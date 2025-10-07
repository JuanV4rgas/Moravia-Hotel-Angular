package com.moravia.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.moravia.demo.model.Servicio;
import com.moravia.demo.service.ServicioService;

@RestController
@RequestMapping("/servicio")
@CrossOrigin(origins = "http://localhost:4200")
public class ServicioController {

    @Autowired
    ServicioService servicioService;

    @GetMapping("/all")
    public List<Servicio> mostrarServicios() {
        return servicioService.searchAll();
    }

    @GetMapping("/find/{id}")
    public Servicio mostrarServicio(@PathVariable("id") Long id) {
        return servicioService.searchById(id);
    }

    @PostMapping("/add")
    public void agregarServicio(@RequestBody Servicio servicio) {
        servicioService.add(servicio);
    }

    @DeleteMapping("/delete/{id}")
    public void eliminarServicio(@PathVariable("id") Long id) {
        servicioService.deleteById(id);
    }

    @PostMapping("/update/{id}")
    public void actualizarServicio(@RequestBody Servicio servicio, @PathVariable("id") Long id) {
        servicio.setIdServicio(id);
        servicioService.update(servicio);
    }
}
