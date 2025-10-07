package com.moravia.demo.service;

import java.util.List;

import com.moravia.demo.model.Habitacion;

public interface HabitacionService {

    public List<Habitacion> findAll();

    public Habitacion findById(Long idHabitacion);

    public void add(Habitacion habitacion);

    public void update(Habitacion habitacion);

    public void deleteById(Long idHabitacion);
}
