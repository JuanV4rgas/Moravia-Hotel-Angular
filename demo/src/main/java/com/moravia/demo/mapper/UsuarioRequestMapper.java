package com.moravia.demo.mapper;

import com.moravia.demo.dto.request.CrearUsuarioRequestDTO;
import com.moravia.demo.dto.request.ActualizarUsuarioRequestDTO;
import com.moravia.demo.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioRequestMapper {

    public Usuario toEntity(CrearUsuarioRequestDTO dto) {
        if (dto == null) return null;
        
        Usuario usuario = new Usuario();
        usuario.setEmail(dto.getEmail());
        usuario.setClave(dto.getClave());
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setCedula(dto.getCedula());
        usuario.setTelefono(dto.getTelefono());
        usuario.setFotoPerfil(dto.getFotoPerfil());
        usuario.setTipo(dto.getTipo());
        
        return usuario;
    }

    public void updateEntity(Usuario usuario, ActualizarUsuarioRequestDTO dto) {
        if (dto.getEmail() != null) usuario.setEmail(dto.getEmail());
        if (dto.getNombre() != null) usuario.setNombre(dto.getNombre());
        if (dto.getApellido() != null) usuario.setApellido(dto.getApellido());
        if (dto.getCedula() != null) usuario.setCedula(dto.getCedula());
        if (dto.getTelefono() != null) usuario.setTelefono(dto.getTelefono());
        if (dto.getFotoPerfil() != null) usuario.setFotoPerfil(dto.getFotoPerfil());
        if (dto.getTipo() != null) usuario.setTipo(dto.getTipo());
        
        // Solo actualizar clave si no está vacía
        if (dto.getClave() != null && !dto.getClave().trim().isEmpty()) {
            usuario.setClave(dto.getClave());
        }
    }
}