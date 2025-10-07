package com.moravia.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moravia.demo.model.Cliente;
import com.moravia.demo.repository.ClienteRepository;

@Service
public class ClienteServiceImpl implements ClienteService {

    @Autowired
    ClienteRepository repo;

    @Override
    public Cliente searchById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public List<Cliente> searchAll() {
        return repo.findAll();
    }

    @Override
    public void add(Cliente cliente) {
        repo.save(cliente);
    }

    @Override
    public void update(Cliente cliente) {
        repo.save(cliente);
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}
