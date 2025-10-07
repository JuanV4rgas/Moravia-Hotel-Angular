package com.moravia.demo.service;

import java.util.List;

import com.moravia.demo.model.Usuario;



public interface UsuarioService {
    // Operaciones CRUD básicas
    public List<Usuario> findAll();

    public Usuario findById(Long idUsuario);

    public void add(Usuario usuario);

    public void update(Usuario usuario);
    
    public void deleteById(Long idUsuario);
    
    public Usuario findByEmail(String email);

    public boolean validarCredenciales(String email, String clave);
}