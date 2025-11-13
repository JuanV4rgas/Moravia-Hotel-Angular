package com.moravia.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moravia.demo.model.Role;
import com.moravia.demo.model.Usuario;
import com.moravia.demo.repository.RoleRepository;
import com.moravia.demo.repository.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    UsuarioRepository repo;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    EmailService emailService;

    @Override
    public Usuario searchById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public List<Usuario> searchAll() {
        return repo.findAll();
    }

    @Override
    public void add(Usuario usuario) {
        // Asignar rol por defecto basado en el tipo de usuario
        if (usuario.getRoles() == null || usuario.getRoles().isEmpty()) {
            String roleName = determineRoleByType(usuario.getTipo());
            Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role " + roleName + " no encontrado"));
            usuario.getRoles().add(role);
        }
        
        repo.save(usuario);
        // Send confirmation email

        
        try {
            emailService.sendConfirmationEmail(usuario.getEmail(), usuario.getNombre());
        } catch (Exception e) {
            // Log error but don't fail registration
            System.err.println("Error sending confirmation email: " + e.getMessage());
        }
            
    }

    public void update(Usuario usuario) {
    Usuario existing = repo.findById(usuario.getIdUsuario())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    // Solo actualizamos los campos modificables
    existing.setNombre(usuario.getNombre());
    existing.setApellido(usuario.getApellido());
    existing.setEmail(usuario.getEmail());
    existing.setTelefono(usuario.getTelefono());
    existing.setCedula(usuario.getCedula());
    existing.setFotoPerfil(usuario.getFotoPerfil());
    existing.setTipo(usuario.getTipo());

    // ⚠️ Solo actualiza la clave si el campo no está vacío
    if (usuario.getClave() != null && !usuario.getClave().trim().isEmpty()) {
        existing.setClave(usuario.getClave());
    }

    // Asignar rol si no tiene
    if (existing.getRoles() == null || existing.getRoles().isEmpty()) {
        String roleName = determineRoleByType(existing.getTipo());
        Role role = roleRepository.findByName(roleName)
            .orElseThrow(() -> new RuntimeException("Role " + roleName + " no encontrado"));
        existing.getRoles().add(role);
    }

    repo.save(existing);
}


    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    @Override
    public Usuario searchByEmail(String email) {
        return repo.findByEmail(email);
    }

    @Override
    public List<Usuario> searchClientes() {
        return repo.findClientes();
    }

    /**
     * Determina el nombre del rol basado en el tipo de usuario
     */
    private String determineRoleByType(String tipo) {
        if (tipo == null) {
            return "ROLE_CLIENTE";
        }
        return switch (tipo.toLowerCase()) {
            case "administrador" -> "ROLE_ADMIN";
            case "operador" -> "ROLE_OPERADOR";
            case "cliente" -> "ROLE_CLIENTE";
            default -> "ROLE_CLIENTE";
        };
    }
}
