package com.moravia.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.moravia.demo.model.Reserva;
import com.moravia.demo.service.ReservaService;

@RestController
@RequestMapping("/reserva")
@CrossOrigin(origins = "http://localhost:4200")
public class ReservaController {

    @Autowired
    ReservaService reservaService;

    @GetMapping("/all")
    public List<Reserva> mostrarReservas() {
        return reservaService.searchAll();
    }

    @GetMapping("/find/{id}")
    public Reserva mostrarReserva(@PathVariable("id") Long id) {
        return reservaService.searchById(id);
    }

    @PostMapping("/add")
    public void agregarReserva(@RequestBody Reserva reserva) {
        reservaService.add(reserva);
    }

    @DeleteMapping("/delete/{id}")
    public void eliminarReserva(@PathVariable("id") Long id) {
        reservaService.deleteById(id);
    }

    @PostMapping("/update/{id}")
    public void actualizarReserva(@RequestBody Reserva reserva, @PathVariable("id") Long id) {
        reserva.setId(id);
        reservaService.update(reserva);
    }
}
