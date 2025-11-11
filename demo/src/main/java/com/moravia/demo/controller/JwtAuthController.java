package com.moravia.demo.controller;

import com.moravia.demo.dto.request.LoginRequestDTO;
import com.moravia.demo.dto.response.LoginResponseDTO;
import com.moravia.demo.dto.response.UserInfoDTO;
import com.moravia.demo.model.Usuario;
import com.moravia.demo.security.JwtTokenProvider;
import com.moravia.demo.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class JwtAuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getClave()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        String token = tokenProvider.generateToken(request.getEmail(), roles);
        Usuario usuario = usuarioService.searchByEmail(request.getEmail());

        LoginResponseDTO response = new LoginResponseDTO(token, usuario.getNombre(), usuario.getTipo(), roles);
        return ResponseEntity.ok(response);
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

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // Stateless: el cliente debe eliminar el token del almacenamiento
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }
}

