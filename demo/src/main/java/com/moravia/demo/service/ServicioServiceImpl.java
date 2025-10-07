package com.moravia.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import com.moravia.demo.model.Servicio;
import com.moravia.demo.repository.ServicioRepository;

@Service
public class ServicioServiceImpl implements ServicioService {

    @Autowired
    ServicioRepository repo;

    @Override
    public List<Servicio> findAll() {
        return repo.findAll();
    }

    @Override
    public Servicio findById(Long idServicio) {
        return repo.findById(idServicio).orElse(null);
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
    public void deleteById(Long idServicio) {
        repo.deleteById(idServicio);
    }

}
