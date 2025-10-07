package com.moravia.demo.service;

import java.util.List;
import com.moravia.demo.model.Servicio;

public interface ServicioService {
    public Servicio searchById(Long id);
    public List<Servicio> searchAll();
    public void add(Servicio servicio);
    public void update(Servicio servicio);
    public void deleteById(Long id);
}
