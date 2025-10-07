package com.moravia.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.moravia.demo.model.Servicio;
import com.moravia.demo.service.ServicioService;

@RestController
@RequestMapping("/servicios")
@CrossOrigin(origins = "http://localhost:4200")
public class ServicioController {

    @Autowired
    private ServicioService servicioService;

    // ============================================================
    // GET http://localhost:8081/servicios
    // ➜ Devuelve la lista completa de servicios
    // ============================================================
    @GetMapping
    public List<Servicio> listarServicios() {
        return servicioService.findAll();
    }

    // ============================================================
    // GET http://localhost:8081/servicios/{idServicio}
    // ➜ Devuelve un servicio específico según su ID
    // Ejemplo: http://localhost:8081/servicios/3
    // ============================================================
    @GetMapping("/{idServicio}")
    public Servicio obtenerServicio(@PathVariable Long idServicio) {
        return servicioService.findById(idServicio);
    }

    // ============================================================
    // POST http://localhost:8081/servicios
    // ➜ Crea un nuevo servicio
    // Se debe enviar un JSON en el body con los datos del servicio
    // Ejemplo:
    // {
    //   "nombre": "Spa Deluxe",
    //   "descripcion": "Masajes relajantes y aromaterapia",
    //   "precio": 180000,
    //   "categoria": "Bienestar"
    // }
    // ============================================================
    @PostMapping
    public void crearServicio(@RequestBody Servicio servicio) {
        servicioService.add(servicio);
    }

    // ============================================================
    // PUT http://localhost:8081/servicios/{idServicio}
    // ➜ Actualiza un servicio existente según su ID
    // Ejemplo: http://localhost:8081/servicios/5
    // Se debe enviar el JSON actualizado con los nuevos valores
    // ============================================================
    @PutMapping("/{idServicio}")
    public void actualizarServicio(@PathVariable Long idServicio, @RequestBody Servicio servicio) {
        servicio.setIdServicio(idServicio);
        servicioService.update(servicio);
    }

    // ============================================================
    // DELETE http://localhost:8081/servicios/{idServicio}
    // ➜ Elimina un servicio específico según su ID
    // Ejemplo: http://localhost:8081/servicios/2
    // ============================================================
    @DeleteMapping("/{idServicio}")
    public void eliminarServicio(@PathVariable Long idServicio) {
        servicioService.deleteById(idServicio);
    }
}
