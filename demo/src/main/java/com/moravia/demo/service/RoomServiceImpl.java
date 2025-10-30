package com.moravia.demo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moravia.demo.model.Room;
import com.moravia.demo.model.Roomtype;
import com.moravia.demo.repository.RoomRepository;
import com.moravia.demo.repository.RoomtypeRepository;

@Service
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomtypeRepository roomtypeRepository;

    @Override
    public List<Room> searchAll() {
        return roomRepository.findAll();
    }

    @Override
    public Room searchById(Integer id) {
        return roomRepository.findById(id).orElse(null);
    }

    @Override
    public void add(Room room) {
        roomRepository.save(room);
    }

    @Override
    public void update(Room room) {
        roomRepository.save(room);
    }

    @Override
    public void deleteById(Integer id) {
        roomRepository.deleteById(id);
    }

    // ========================================================
    // 🔍 Buscar habitaciones disponibles por tipo y fechas
    // ========================================================
    @Override
    public List<Room> findAvailableRoomsByTypeAndDate(Integer typeId, LocalDate inicio, LocalDate fin) {
        Roomtype type = roomtypeRepository.findById(typeId)
            .orElseThrow(() -> new RuntimeException("Tipo de habitación no encontrado"));

        // Filtramos habitaciones del tipo que estén disponibles
        return type.getRooms().stream()
            .filter(room -> room.estaDisponibleEn(inicio, fin))
            .collect(Collectors.toList());
    }
}
