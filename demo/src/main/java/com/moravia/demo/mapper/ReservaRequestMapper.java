package com.moravia.demo.mapper;

import com.moravia.demo.dto.request.CrearReservaRequestDTO;
import com.moravia.demo.dto.request.ActualizarReservaRequestDTO;
import com.moravia.demo.model.Reserva;
import com.moravia.demo.model.Usuario;
import com.moravia.demo.model.Room;
import com.moravia.demo.repository.UsuarioRepository;
import com.moravia.demo.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ReservaRequestMapper {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RoomRepository roomRepository;

    public Reserva toEntity(CrearReservaRequestDTO dto) {
        if (dto == null) return null;
        
        Reserva reserva = new Reserva();
        reserva.setFechaInicio(LocalDate.parse(dto.getFechaInicio()));
        reserva.setFechaFin(LocalDate.parse(dto.getFechaFin()));
        reserva.setEstado(dto.getEstado());
        
        // Buscar cliente
        Usuario cliente = usuarioRepository.findById(dto.getClienteId())
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        reserva.setCliente(cliente);
        
        // Buscar rooms
        List<Room> rooms = dto.getRoomIds().stream()
            .map(id -> roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room no encontrada: " + id)))
            .collect(Collectors.toList());
        reserva.setRooms(rooms);
        
        return reserva;
    }

    public void updateEntity(Reserva reserva, ActualizarReservaRequestDTO dto) {
        if (dto.getFechaInicio() != null) {
            reserva.setFechaInicio(LocalDate.parse(dto.getFechaInicio()));
        }
        if (dto.getFechaFin() != null) {
            reserva.setFechaFin(LocalDate.parse(dto.getFechaFin()));
        }
        if (dto.getEstado() != null) {
            reserva.setEstado(dto.getEstado());
        }
        if (dto.getRoomIds() != null) {
            List<Room> rooms = dto.getRoomIds().stream()
                .map(id -> roomRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Room no encontrada: " + id)))
                .collect(Collectors.toList());
            reserva.setRooms(rooms);
        }
    }
}