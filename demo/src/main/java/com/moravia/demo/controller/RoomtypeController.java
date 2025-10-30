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


/**
 * Returns a list of all room types available in the system.
 *
 * @return A list of room types.
 */
    @GetMapping("/all")
    public List<Roomtype> mostrarTipos() {
        return roomtypeService.searchAll();
    }

    /**
     * Returns a room type object by its id.
     *
     * @param id The id of the room type to be retrieved.
     * @return The room type object associated with the given id.
     */
    @GetMapping("/find/{id}")
    public Roomtype mostrarTipo(@PathVariable("id") Integer id) {
        return roomtypeService.searchById(id);
    }

    /**
     * Agrega un nuevo tipo de habitaci n a la base de datos.
     * 
     * @param roomtype el objeto de tipo Roomtype con los datos del tipo de habitaci n a agregar.
     */
    @PostMapping("/add")
    public void agregarTipo(@RequestBody Roomtype roomtype) {
        roomtypeService.add(roomtype);
    }

    /**
     * Elimina un tipo de habitaci n de la base de datos.
     * 
     * @param id el ID del tipo de habitaci n a eliminar.
     */
    @DeleteMapping("/delete/{id}")
    public void eliminarTipo(@PathVariable("id") Integer id) {
        roomtypeService.deleteById(id);
    }

    /**
     * Actualiza un tipo de habitaci n existente en la base de datos.
     * 
     * @param roomtype el objeto de tipo Roomtype con los datos del tipo de habitaci n a actualizar.
     * @param id el ID del tipo de habitaci n a actualizar.
     */
    @PostMapping("/update/{id}")
    public void actualizarTipo(@RequestBody Roomtype roomtype, @PathVariable("id") Integer id) {
        roomtype.setId(id);
        roomtypeService.update(roomtype);
    }
}
