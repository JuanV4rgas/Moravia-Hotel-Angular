package com.moravia.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moravia.demo.model.Reserva;
import com.moravia.demo.repository.ReservaRepository;

@Service
public class ReservaServiceImpl implements ReservaService {

    @Autowired
    ReservaRepository repo;

    @Override
    public Reserva searchById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public List<Reserva> searchAll() {
        return repo.findAll();
    }

    @Override
    public void add(Reserva reserva) {
        repo.save(reserva);
    }

    @Override
    public void update(Reserva reserva) {
        repo.save(reserva);
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}
