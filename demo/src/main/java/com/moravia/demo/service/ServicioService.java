package com.moravia.demo.service;

import java.util.List;

import com.moravia.demo.model.Servicio;

public interface ServicioService {

    public List<Servicio> findAll();

    public Servicio findById(Long idServicio);

    public void add(Servicio servicio);

    public void update(Servicio servicio);

    public void deleteById(Long idServicio);

}
