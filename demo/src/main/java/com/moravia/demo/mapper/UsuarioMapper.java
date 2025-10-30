package com.moravia.demo.mapper;

import com.moravia.demo.dto.response.*;
import com.moravia.demo.model.Usuario;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class UsuarioMapper {

    // Usuario → UsuarioResponseDTO (sin reservas)
    public UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        if (usuario == null) return null;
        
        return new UsuarioResponseDTO(
            usuario.getIdUsuario(),
            usuario.getEmail(),
            usuario.getClave(),
            usuario.getNombre(),
            usuario.getApellido(),
            usuario.getCedula(),
            usuario.getTelefono(),
            usuario.getFotoPerfil(),
            usuario.getTipo()
            // ⚠️ NO incluye 'clave'
        );
    }

    // Usuario → ClienteSimpleDTO (solo datos básicos)
    public ClienteSimpleDTO toClienteSimpleDTO(Usuario usuario) {
        if (usuario == null) return null;
        
        return new ClienteSimpleDTO(
            usuario.getIdUsuario(),
            usuario.getNombre(),
            usuario.getApellido(),
            usuario.getEmail()
        );
    }

    // Usuario → UsuarioConReservasDTO (con reservas simplificadas)
    public UsuarioConReservasDTO toUsuarioConReservasDTO(Usuario usuario, ReservaMapper reservaMapper) {
        if (usuario == null) return null;
        
        UsuarioConReservasDTO dto = new UsuarioConReservasDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setEmail(usuario.getEmail());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setCedula(usuario.getCedula());
        dto.setTelefono(usuario.getTelefono());
        dto.setFotoPerfil(usuario.getFotoPerfil());
        dto.setTipo(usuario.getTipo());
        
        // Reservas simplificadas (sin cliente para evitar loop)
        if (usuario.getReservas() != null) {
            dto.setReservas(
                usuario.getReservas().stream()
                    .map(reservaMapper::toReservaSimpleDTO)
                    .collect(Collectors.toList())
            );
        }
        
        return dto;
    }
}