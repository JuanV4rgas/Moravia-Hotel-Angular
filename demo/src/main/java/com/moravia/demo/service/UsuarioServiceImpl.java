package com.moravia.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moravia.demo.model.Usuario;
import com.moravia.demo.repository.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    UsuarioRepository repo;

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
        repo.save(usuario);
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
}
