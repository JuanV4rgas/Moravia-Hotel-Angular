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

    @Override
    public void update(Usuario usuario) {
        repo.save(usuario);
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    @Override
    public Usuario searchByEmail(String email) {
        return repo.findByEmail(email);
    }
}
