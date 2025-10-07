package com.moravia.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moravia.demo.model.Cuenta;
import com.moravia.demo.repository.CuentaRepository;

@Service
public class CuentaServiceImpl implements CuentaService {

    @Autowired
    CuentaRepository repo;

    @Override
    public Cuenta searchById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public List<Cuenta> searchAll() {
        return repo.findAll();
    }

    @Override
    public void add(Cuenta cuenta) {
        repo.save(cuenta);
    }

    @Override
    public void update(Cuenta cuenta) {
        repo.save(cuenta);
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}
