package com.moravia.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.moravia.demo.model.Roomtype;
import com.moravia.demo.service.RoomtypeService;

@RestController
@RequestMapping("/roomtype")
@CrossOrigin(origins = "http://localhost:4200")
public class RoomtypeController {

    @Autowired
    RoomtypeService roomtypeService;

    @GetMapping("/all")
    public List<Roomtype> mostrarTipos() {
        return roomtypeService.searchAll();
    }

    @GetMapping("/find/{id}")
    public Roomtype mostrarTipo(@PathVariable("id") Integer id) {
        return roomtypeService.searchById(id);
    }

    @PostMapping("/add")
    public void agregarTipo(@RequestBody Roomtype roomtype) {
        roomtypeService.add(roomtype);
    }

    @DeleteMapping("/delete/{id}")
    public void eliminarTipo(@PathVariable("id") Integer id) {
        roomtypeService.deleteById(id);
    }

    @PostMapping("/update/{id}")
    public void actualizarTipo(@RequestBody Roomtype roomtype, @PathVariable("id") Integer id) {
        roomtype.setId(id);
        roomtypeService.update(roomtype);
    }
}
