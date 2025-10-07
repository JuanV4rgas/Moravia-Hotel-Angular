package com.moravia.demo.service;

import java.util.List;
import com.moravia.demo.model.Reserva;

public interface ReservaService {
    public Reserva searchById(Long id);
    public List<Reserva> searchAll();
    public void add(Reserva reserva);
    public void update(Reserva reserva);
    public void deleteById(Long id);
}
    