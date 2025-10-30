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


/**
 * Muestra todos los servicios
 * 
 * @return lista de objetos Servicio con todos los servicios
 */
    @GetMapping("/all")
    public List<Servicio> mostrarServicios() {
        return servicioService.searchAll();
    }

/**
 * Buscar un servicio por su id
 * 
 * @param id id del servicio a buscar
 * @return objeto Servicio con el servicio encontrado
 */
    @GetMapping("/find/{id}")
    public Servicio mostrarServicio(@PathVariable("id") Long id) {
        return servicioService.searchById(id);
    }

/**
 * Agrega un servicio a la base de datos
 * 
 * @param servicio objeto Servicio que se va a agregar
 */
    @PostMapping("/add")
    public void agregarServicio(@RequestBody Servicio servicio) {
        servicioService.add(servicio);
    }

/**
 * Eliminar un servicio por su id
 * 
 * @param id id del servicio a eliminar
 */
    @DeleteMapping("/delete/{id}")
    public void eliminarServicio(@PathVariable("id") Long id) {
        servicioService.deleteById(id);
    }

/**
 * Actualizar un servicio por su id
 * 
 * @param servicio objeto Servicio que se va a actualizar
 * @param id id del servicio a actualizar
 */
    @PostMapping("/update/{id}")
    public void actualizarServicio(@RequestBody Servicio servicio, @PathVariable("id") Long id) {
        servicio.setIdServicio(id);
        servicioService.update(servicio);
    }
}
