package com.moravia.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.moravia.demo.dto.request.ActualizarUsuarioRequestDTO;
import com.moravia.demo.dto.request.CrearUsuarioRequestDTO;
import com.moravia.demo.dto.response.UsuarioConReservasDTO;
import com.moravia.demo.dto.response.UsuarioResponseDTO;
import com.moravia.demo.mapper.ReservaMapper;
import com.moravia.demo.mapper.UsuarioMapper;
import com.moravia.demo.mapper.UsuarioRequestMapper;
import com.moravia.demo.model.Usuario;
import com.moravia.demo.service.UsuarioService;
import com.moravia.demo.service.CaptchaService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/usuario")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private UsuarioMapper usuarioMapper;
    
    @Autowired
    private ReservaMapper reservaMapper;

    @Autowired
    private UsuarioRequestMapper usuarioRequestMapper;
    
    @Autowired
    private CaptchaService captchaService;

    // Lista todos los usuarios (sin reservas)
    @GetMapping("/all")
    public List<UsuarioResponseDTO> mostrarUsuarios() {
        List<Usuario> usuarios = usuarioService.searchAll();
        return usuarios.stream()
            .map(usuarioMapper::toResponseDTO)
            .collect(Collectors.toList());
    }

    // Buscar usuario por ID (sin reservas)
    @GetMapping("/find")
    public UsuarioResponseDTO mostrarUsuario(@RequestParam("id") Long id) {
        Usuario usuario = usuarioService.searchById(id);
        return usuarioMapper.toResponseDTO(usuario);
    }

    // Buscar usuario CON reservas
    @GetMapping("/find/id")
    public UsuarioConReservasDTO mostrarUsuarioPorId(@RequestParam("id") Long id) {
        Usuario usuario = usuarioService.searchById(id);
        return usuarioMapper.toUsuarioConReservasDTO(usuario, reservaMapper);
    }

    // Crear usuario
    @PostMapping("/add")
    public UsuarioResponseDTO agregarUsuario(@RequestBody CrearUsuarioRequestDTO requestDTO, HttpServletRequest servletRequest) {
        String clientIp = resolveClientIp(servletRequest);
        if (!captchaService.verifyToken(requestDTO.getCaptchaToken(), clientIp)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Captcha invalido");
        }
        Usuario usuario = usuarioRequestMapper.toEntity(requestDTO);
        usuarioService.add(usuario);
        return usuarioMapper.toResponseDTO(usuario);
    }

    // Actualizar usuario
    @PostMapping("/update/{id}")
    public UsuarioResponseDTO actualizarUsuario(
            @RequestBody ActualizarUsuarioRequestDTO requestDTO,
            @PathVariable("id") Long id) {
        
        Usuario usuario = usuarioService.searchById(id);
        usuarioRequestMapper.updateEntity(usuario, requestDTO);
        usuarioService.update(usuario);
        return usuarioMapper.toResponseDTO(usuario);
    }

    // Buscar por email
    @GetMapping("/find/email")
    public UsuarioResponseDTO mostrarUsuarioPorEmail(@RequestParam("email") String email) {
        Usuario usuario = usuarioService.searchByEmail(email);
        return usuarioMapper.toResponseDTO(usuario);
    }

    // Listar todos los clientes
    @GetMapping("/clientes")
    public List<UsuarioConReservasDTO> mostrarClientes() {
        List<Usuario> clientes = usuarioService.searchClientes();
        return clientes.stream()
            .map(cliente -> usuarioMapper.toUsuarioConReservasDTO(cliente, reservaMapper))
            .collect(Collectors.toList());
    }

    // Eliminar usuario por ID
    @GetMapping("/delete/{id}")
    public void eliminarUsuario(@PathVariable("id") Long id) {
        usuarioService.deleteById(id);
    }
    
    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
