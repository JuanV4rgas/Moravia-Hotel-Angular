package com.moravia.demo.service;

import java.util.List;
import com.moravia.demo.model.Cliente;

public interface ClienteService {
    public Cliente searchById(Long id);
    public List<Cliente> searchAll();
    public void add(Cliente cliente);
    public void update(Cliente cliente);
    public void deleteById(Long id);
}
