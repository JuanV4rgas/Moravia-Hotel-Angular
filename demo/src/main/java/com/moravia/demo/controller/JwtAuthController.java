package com.moravia.demo.controller;

import com.moravia.demo.dto.request.LoginRequestDTO;
import com.moravia.demo.dto.request.RefreshTokenRequestDTO;
import com.moravia.demo.dto.response.LoginResponseDTO;
import com.moravia.demo.dto.response.UserInfoDTO;
import com.moravia.demo.model.RefreshToken;
import com.moravia.demo.model.Usuario;
import com.moravia.demo.security.JwtTokenProvider;
import com.moravia.demo.service.RefreshTokenService;
import com.moravia.demo.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.AuthenticationException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class JwtAuthController {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
    try {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getClave()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        List<String> roles = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());

        String token = tokenProvider.generateToken(request.getEmail(), roles);
        Usuario usuario = usuarioService.searchByEmail(request.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(usuario);

        LoginResponseDTO response = new LoginResponseDTO(
            token,
            refreshToken.getToken(),
            usuario.getIdUsuario(),
            usuario.getEmail(),
            usuario.getNombre(),
            usuario.getTipo(),
            resolveRoles(usuario, roles)
        );
        return ResponseEntity.ok(response);
    } catch (AuthenticationException ex) {
        // Log full exception for easier debugging and return 401 with a clear message
        logger.info("Authentication failed for email={}: {}", request.getEmail(), ex.toString());
        logger.debug("Authentication exception details:", ex);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
    }
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoDTO> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        String email = auth.getName();
        List<String> roles = auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        Usuario usuario = usuarioService.searchByEmail(email);
        UserInfoDTO dto = new UserInfoDTO(email, usuario.getNombre(), usuario.getTipo(), roles);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(@RequestBody RefreshTokenRequestDTO request) {
        RefreshToken refreshToken = refreshTokenService.findByToken(request.getRefreshToken())
                .map(refreshTokenService::verifyExpiration)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token no válido"));

        Usuario usuario = refreshToken.getUsuario();
        List<String> roles = resolveRoles(usuario, null);
        String token = tokenProvider.generateToken(usuario.getEmail(), roles);

        LoginResponseDTO response = new LoginResponseDTO(
                token,
                refreshToken.getToken(),
                usuario.getIdUsuario(),
                usuario.getEmail(),
                usuario.getNombre(),
                usuario.getTipo(),
                roles
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody(required = false) RefreshTokenRequestDTO request) {
        if (request != null && request.getRefreshToken() != null) {
            refreshTokenService.deleteByToken(request.getRefreshToken());
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }

    private List<String> resolveRoles(Usuario usuario, List<String> fallback) {
        if (usuario.getRoles() != null && !usuario.getRoles().isEmpty()) {
            return usuario.getRoles().stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toList());
        }
        if (fallback != null && !fallback.isEmpty()) {
            return fallback;
        }
        if (usuario.getTipo() != null) {
            String role = switch (usuario.getTipo().toLowerCase()) {
                case "administrador" -> "ROLE_ADMIN";
                case "operador" -> "ROLE_OPERADOR";
                case "cliente" -> "ROLE_CLIENTE";
                default -> "ROLE_CLIENTE";
            };
            return List.of(role);
        }
        return List.of();
    }
}
