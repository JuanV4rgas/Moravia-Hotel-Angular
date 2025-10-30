package com.moravia.demo.service;

import java.util.List;
import com.moravia.demo.model.Usuario;

public interface UsuarioService {
    public Usuario searchById(Long id);
    public List<Usuario> searchAll();
    public void add(Usuario usuario);
    public void update(Usuario usuario);
    public void deleteById(Long id);
    public Usuario searchByEmail(String email);
    public List<Usuario> searchClientes();
}
