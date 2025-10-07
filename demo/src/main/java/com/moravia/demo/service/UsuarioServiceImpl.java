package com.moravia.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.moravia.demo.model.Usuario;
import com.moravia.demo.repository.UsuarioRepository;
import java.util.List;
@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository repo;

    @Override
    public List<Usuario> findAll() {
        return repo.findAll();
    }

    @Override
    public Usuario findById(Long idUsuario) {
        return repo.findById(idUsuario).get();
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
    public void deleteById(Long idUsuario) {
        repo.deleteById(idUsuario);
    }

    @Override
    public Usuario findByEmail(String email) {
        return repo.findByEmail(email);
    }

    @Override
    public boolean validarCredenciales(String email, String clave) {
        Usuario usuario = repo.findByEmail(email);
        return usuario != null && usuario.getClave().equals(clave);
    }
}