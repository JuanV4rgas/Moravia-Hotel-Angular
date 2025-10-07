package com.moravia.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import com.moravia.demo.model.Habitacion;
import com.moravia.demo.repository.HabitacionRepository;

@Service
public class HabitacionServiceImpl implements HabitacionService {

    @Autowired
    private HabitacionRepository repo;

    @Override
    public List<Habitacion> findAll() {
        return repo.findAll();
    }

    @Override
    public Habitacion findById(Long idHabitacion) {
        return repo.findById(idHabitacion).orElse(null);
    }

    @Override
    public void add(Habitacion habitacion) {
        repo.save(habitacion);
    }

    @Override
    public void update(Habitacion habitacion) {
        repo.save(habitacion);
    }

    @Override
    public void deleteById(Long idHabitacion) {
        repo.deleteById(idHabitacion);
    }
}
