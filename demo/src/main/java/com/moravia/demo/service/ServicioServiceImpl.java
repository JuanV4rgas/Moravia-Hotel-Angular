package com.moravia.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moravia.demo.model.Servicio;
import com.moravia.demo.repository.ServicioRepository;

@Service
public class ServicioServiceImpl implements ServicioService {

    @Autowired
    ServicioRepository repo;

    @Override
    public Servicio searchById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public List<Servicio> searchAll() {
        return repo.findAll();
    }

    @Override
    public void add(Servicio servicio) {
        repo.save(servicio);
    }

    @Override
    public void update(Servicio servicio) {
        repo.save(servicio);
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}
