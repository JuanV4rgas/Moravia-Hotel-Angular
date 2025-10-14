package com.moravia.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.moravia.demo.model.Room;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

import com.moravia.demo.model.Reserva;
import com.moravia.demo.service.ReservaService;


@RestController
@RequestMapping("/reserva")
@CrossOrigin(origins = "http://localhost:4200")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    // ✅ 1️⃣ Obtener todas las reservas
    // http://localhost:8081/reserva/all
    @GetMapping("/all")
    public List<Reserva> mostrarReservas() {
        return reservaService.searchAll();
    }

    // ✅ 2️⃣ Buscar una reserva por ID
    // http://localhost:8081/reserva/find/1
    @GetMapping("/find/{id}")
    public Reserva mostrarReserva(@PathVariable("id") Integer id) {
        return reservaService.searchById(id);
    }

    // ✅ 3️⃣ Crear una nueva reserva
    // http://localhost:8081/reserva/add
    @PostMapping(value = "/add", consumes = "application/json", produces = "application/json")
    public void agregarReserva(@RequestBody Reserva reserva) {
        reservaService.add(reserva);
    }

    // ✅ 4️⃣ Eliminar una reserva
    // http://localhost:8081/reserva/delete/1
    @DeleteMapping("/delete/{id}")
    public void eliminarReserva(@PathVariable("id") Integer id) {
        reservaService.deleteById(id);
    }

    // ✅ 5️⃣ Actualizar una reserva existente
    // http://localhost:8081/reserva/update/1
    @PutMapping(value = "/update/{id}", consumes = "application/json", produces = "application/json")
    public void actualizarReserva(@RequestBody Reserva reserva, @PathVariable("id") Integer id) {
        reserva.setId(id);
        reservaService.update(reserva);
    }

    // ✅ 6️⃣ 
    // Verificar disponibilidad antes de crear una reserva
    //http://localhost:8081/reserva/checkDisponibilidad?fechaInicio=2025-10-01&fechaFin=2025-10-05
    @GetMapping("/checkDisponibilidad")
    public List<Room> verificarDisponibilidad(
            @RequestParam("fechaInicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam("fechaFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        // Este método se implementará en ReservaService para filtrar habitaciones disponibles
        return reservaService.buscarHabitacionesDisponibles(fechaInicio, fechaFin);
            
    }
    
}
