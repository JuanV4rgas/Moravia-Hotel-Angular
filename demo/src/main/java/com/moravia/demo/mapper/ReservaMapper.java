package com.moravia.demo.mapper;

import com.moravia.demo.dto.response.*;
import com.moravia.demo.model.Reserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class ReservaMapper {

    @Autowired
    private UsuarioMapper usuarioMapper;

    @Autowired
    private RoomMapper roomMapper;

    @Autowired
    @Lazy
    private CuentaMapper cuentaMapper;

    // Reserva → ReservaResponseDTO (completo)
    public ReservaResponseDTO toResponseDTO(Reserva reserva) {
        if (reserva == null) return null;
        
        ReservaResponseDTO dto = new ReservaResponseDTO();
        dto.setId(reserva.getId());
        dto.setFechaInicio(reserva.getFechaInicio() != null ? reserva.getFechaInicio().toString() : null);
        dto.setFechaFin(reserva.getFechaFin() != null ? reserva.getFechaFin().toString() : null);
        dto.setEstado(reserva.getEstado());
        
        // Cliente simplificado
        dto.setCliente(usuarioMapper.toClienteSimpleDTO(reserva.getCliente()));
        
        // Rooms simplificadas
        if (reserva.getRooms() != null) {
            dto.setRooms(
                reserva.getRooms().stream()
                    .map(roomMapper::toSimpleDTO)
                    .collect(Collectors.toList())
            );
        }
        
        // Cuenta simplificada (sin reserva para evitar loop)
        if (reserva.getCuenta() != null) {
            dto.setCuenta(cuentaMapper.toCuentaSimpleDTO(reserva.getCuenta()));
        }
        
        return dto;
    }

    // Reserva → ReservaSimpleDTO (para usar dentro de Cuenta o Usuario)
    public ReservaSimpleDTO toReservaSimpleDTO(Reserva reserva) {
        if (reserva == null) return null;
        
        return new ReservaSimpleDTO(
            reserva.getId(),
            reserva.getFechaInicio() != null ? reserva.getFechaInicio().toString() : null,
            reserva.getFechaFin() != null ? reserva.getFechaFin().toString() : null,
            reserva.getEstado()
        );
    }
}