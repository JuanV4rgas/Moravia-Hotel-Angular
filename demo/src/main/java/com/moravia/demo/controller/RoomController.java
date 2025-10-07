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
    RoomService roomService;

    @GetMapping("/all")
    public List<Room> mostrarRooms() {
        return roomService.searchAll();
    }

    @GetMapping("/find/{id}")
    public Room mostrarRoom(@PathVariable("id") String id) {
        return roomService.searchById(id);
    }

    @PostMapping("/add")
    public void agregarRoom(@RequestBody Room room) {
        roomService.add(room);
    }

    @DeleteMapping("/delete/{id}")
    public void eliminarRoom(@PathVariable("id") String id) {
        roomService.deleteById(id);
    }

    @PostMapping("/update/{id}")
    public void actualizarRoom(@RequestBody Room room, @PathVariable("id") String id) {
        room.setId(id);
        roomService.update(room);
    }
}
