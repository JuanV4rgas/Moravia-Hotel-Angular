package com.moravia.demo.service;

import java.util.List;
import com.moravia.demo.model.Reserva;
import com.moravia.demo.model.Room;
import java.time.LocalDate;

public interface ReservaService {
    Reserva searchById(Integer id);
    List<Reserva> searchAll();
    void add(Reserva reserva);
    void update(Reserva reserva);
    void deleteById(Integer id);

    List<Room> buscarHabitacionesDisponibles(LocalDate fechaInicio, LocalDate fechaFin);
    List<Reserva> buscarReservasActivas();
}
