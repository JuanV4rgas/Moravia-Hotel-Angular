package com.moravia.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.moravia.demo.model.Habitacion;
import com.moravia.demo.service.HabitacionService;

@RestController
@RequestMapping("/habitaciones")
@CrossOrigin(origins = "http://localhost:4200")
public class HabitacionController {

    @Autowired
    private HabitacionService habitacionService;

    // ============================================================
    // GET http://localhost:8081/habitaciones
    // ➜ Devuelve la lista completa de habitaciones
    // ============================================================
    @GetMapping
    public List<Habitacion> listarHabitaciones() {
        return habitacionService.findAll();
    }

    // ============================================================
    // GET http://localhost:8081/habitaciones/{idHabitacion}
    // ➜ Devuelve una habitación específica según su ID
    // Ejemplo: http://localhost:8081/habitaciones/3
    // ============================================================
    @GetMapping("/{idHabitacion}")
    public Habitacion obtenerHabitacion(@PathVariable Long idHabitacion) {
        return habitacionService.findById(idHabitacion);
    }

    // ============================================================
    // POST http://localhost:8081/habitaciones
    // ➜ Crea una nueva habitación
    // Se debe enviar un JSON en el body con los datos de la habitación
    // Ejemplo:
    // {
    //   "nombre": "Suite Moravia",
    //   "descripcion": "Vista al jardín, cama king y baño privado",
    //   "precio": 320000,
    //   "disponible": true
    // }
    // ============================================================
    @PostMapping
    public void crearHabitacion(@RequestBody Habitacion habitacion) {
        habitacionService.add(habitacion);
    }

    // ============================================================
    // PUT http://localhost:8081/habitaciones/{idHabitacion}
    // ➜ Actualiza una habitación existente según su ID
    // Ejemplo: http://localhost:8081/habitaciones/5
    // Se debe enviar el JSON actualizado con los nuevos valores
    // ============================================================
    @PutMapping("/{idHabitacion}")
    public void actualizarHabitacion(@PathVariable Long idHabitacion, @RequestBody Habitacion habitacion) {
        habitacion.setIdHabitacion(idHabitacion);
        habitacionService.update(habitacion);
    }

    // ============================================================
    // DELETE http://localhost:8081/habitaciones/{idHabitacion}
    // ➜ Elimina una habitación específica según su ID
    // Ejemplo: http://localhost:8081/habitaciones/2
    // ============================================================
    @DeleteMapping("/{idHabitacion}")
    public void eliminarHabitacion(@PathVariable Long idHabitacion) {
        habitacionService.deleteById(idHabitacion);
    }
}
