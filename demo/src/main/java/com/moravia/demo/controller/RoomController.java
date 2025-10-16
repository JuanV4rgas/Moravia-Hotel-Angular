package com.moravia.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.moravia.demo.model.Room;
import com.moravia.demo.service.RoomService;

@RestController
@RequestMapping("/room")
@CrossOrigin(origins = "http://localhost:4200")
public class RoomController {

    @Autowired
    private RoomService roomService;

    /**
     * Retorna una lista de todas las habitaciones existentes en la base de datos.
     * 
     * @return una lista de objetos de tipo Room con todas las habitaciones existentes en la base de datos.
     */
    @GetMapping("/all")
    public List<Room> mostrarRooms() {
        return roomService.searchAll();
    }

    /**
     * Buscar una habitación por su ID.
     * 
     * @param id el ID de la habitación a buscar.
     * @return la habitación con el ID especificado, o null si no se encuentra.
     */
    @GetMapping("/find/{id}")
    public Room mostrarRoom(@PathVariable("id") Integer id) {
        return roomService.searchById(id);
    }

    /**
     * Agrega una nueva habitaci n a la base de datos.
     * 
     * @param room el objeto de tipo Room con los datos de la habitaci n a agregar.
     */
    @PostMapping("/add")
    public void agregarRoom(@RequestBody Room room) {
        roomService.add(room);
    }

    /**
     * Elimina una habitaci n de la base de datos.
     * 
     * @param id el ID de la habitaci n a eliminar.
     */
    @DeleteMapping("/delete/{id}")
    public void eliminarRoom(@PathVariable("id") Integer id) {
        roomService.deleteById(id);
    }

    /**
     * Actualiza una habitaci n existente en la base de datos.
     * 
     * @param room el objeto de tipo Room con los datos de la habitaci n a actualizar.
     * @param id el ID de la habitaci n a actualizar.
     */
    @PutMapping("/update/{id}")
    public void actualizarRoom(@RequestBody Room room, @PathVariable("id") Integer id) {
        room.setId(id);
        roomService.update(room);
    }
}
