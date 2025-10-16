package com.moravia.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.moravia.demo.model.Room;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

import com.moravia.demo.dto.request.ActualizarReservaRequestDTO;
import com.moravia.demo.dto.request.CrearReservaRequestDTO;
import com.moravia.demo.dto.response.ReservaResponseDTO;
import com.moravia.demo.dto.response.RoomSimpleDTO;
import com.moravia.demo.mapper.ReservaMapper;
import com.moravia.demo.mapper.ReservaRequestMapper;
import com.moravia.demo.mapper.RoomMapper;
import com.moravia.demo.model.Reserva;
import com.moravia.demo.service.ReservaService;


@RestController
@RequestMapping("/reserva")
@CrossOrigin(origins = "http://localhost:4200")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;
    
    @Autowired
    private ReservaMapper reservaMapper; 

    @Autowired
    private ReservaRequestMapper reservaRequestMapper;

    @Autowired
    private RoomMapper roomMapper;

    // Obtener todas las reservas (con DTOs)
    @GetMapping("/all")
    public List<ReservaResponseDTO> mostrarReservas() {
        List<Reserva> reservas = reservaService.searchAll();
        return reservas.stream()
            .map(reservaMapper::toResponseDTO)
            .collect(Collectors.toList());
    }

    // Buscar una reserva por ID
    @GetMapping("/find/{id}")
    public ReservaResponseDTO mostrarReserva(@PathVariable("id") Integer id) {
        Reserva reserva = reservaService.searchById(id);
        return reservaMapper.toResponseDTO(reserva);
    }

    // Crear nueva reserva (recibe DTO, retorna DTO)
    @PostMapping(value = "/add", consumes = "application/json", produces = "application/json")
    public ReservaResponseDTO agregarReserva(@RequestBody CrearReservaRequestDTO requestDTO) {
        Reserva reserva = reservaRequestMapper.toEntity(requestDTO);
        reservaService.add(reserva);
        return reservaMapper.toResponseDTO(reserva);
    }

    // Actualizar reserva
    @PutMapping(value = "/update/{id}", consumes = "application/json", produces = "application/json")
    public ReservaResponseDTO actualizarReserva(
            @RequestBody ActualizarReservaRequestDTO requestDTO, 
            @PathVariable("id") Integer id) {
        
        Reserva reserva = reservaService.searchById(id);
        reservaRequestMapper.updateEntity(reserva, requestDTO);
        reservaService.update(reserva);
        return reservaMapper.toResponseDTO(reserva);
    }

    // Verificar disponibilidad
    @GetMapping("/checkDisponibilidad")
    public List<RoomSimpleDTO> verificarDisponibilidad(
            @RequestParam("fechaInicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam("fechaFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        
        List<Room> rooms = reservaService.buscarHabitacionesDisponibles(fechaInicio, fechaFin);
        return rooms.stream()
            .map(roomMapper::toSimpleDTO)
            .collect(Collectors.toList());
    }
}
