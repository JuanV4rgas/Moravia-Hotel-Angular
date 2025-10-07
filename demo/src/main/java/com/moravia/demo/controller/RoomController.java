package com.moravia.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.moravia.demo.model.Room;
import com.moravia.demo.service.RoomService;

@RestController
@RequestMapping("/rooms")
@CrossOrigin(origins = "http://localhost:4200")
public class RoomController {

    @Autowired
    private RoomService roomService;

    // ============================================================
    // GET http://localhost:8081/rooms
    // ➜ Devuelve la lista completa de rooms
    // ============================================================
    @GetMapping
    public List<Room> listarRooms() {
        return roomService.findAll();
    }

    // ============================================================
    // GET http://localhost:8081/rooms/{id}
    // ➜ Devuelve un room específico según su ID
    // Ejemplo: http://localhost:8081/rooms/3
    // ============================================================
    @GetMapping("/{id}")
    public Room obtenerRoom(@PathVariable Long id) {
        return roomService.findById(id);
    }

    // ============================================================
    // POST http://localhost:8081/rooms
    // ➜ Crea un nuevo room
    // Se debe enviar un JSON en el body con los datos del room
    // Ejemplo:
    // {
    //   "nombre": "Room Deluxe",
    //   "descripcion": "Vista al mar, cama king, aire acondicionado",
    //   "precio": 450000,
    //   "tipo": {
    //       "idHabitacion": 2
    //   }
    // }
    // ============================================================
    @PostMapping
    public void crearRoom(@RequestBody Room room) {
        roomService.add(room);
    }

    // ============================================================
    // PUT http://localhost:8081/rooms/{id}
    // ➜ Actualiza un room existente según su ID
    // Ejemplo: http://localhost:8081/rooms/5
    // Se debe enviar el JSON actualizado con los nuevos valores
    // ============================================================
    @PutMapping("/{id}")
    public void actualizarRoom(@PathVariable Long id, @RequestBody Room room) {
        room.setId(id);
        roomService.update(room);
    }

    // ============================================================
    // DELETE http://localhost:8081/rooms/{id}
    // ➜ Elimina un room específico según su ID
    // Ejemplo: http://localhost:8081/rooms/2
    // ============================================================
    @DeleteMapping("/{id}")
    public void eliminarRoom(@PathVariable Long id) {
        roomService.deleteById(id);
    }
}
