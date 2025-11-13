package com.moravia.demo.mapper;

import com.moravia.demo.dto.response.*;
import com.moravia.demo.model.Cuenta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class CuentaMapper {

    @Autowired
    private ServicioMapper servicioMapper;

    @Autowired
    private ReservaMapper reservaMapper;

    // Cuenta → CuentaResponseDTO (con reserva simplificada)
    public CuentaResponseDTO toResponseDTO(Cuenta cuenta) {
        if (cuenta == null) return null;
        
        CuentaResponseDTO dto = new CuentaResponseDTO();
        dto.setId(cuenta.getId());
        dto.setEstado(cuenta.getEstado()); // ✅ Asegurar que se incluya el estado
        dto.setTotal(cuenta.getTotal());
        dto.setSaldo(cuenta.getSaldo());
        
        // Reserva simplificada (sin cliente, rooms, cuenta)
        if (cuenta.getReserva() != null) {
            dto.setReserva(reservaMapper.toReservaSimpleDTO(cuenta.getReserva()));
        }
        
        // Servicios
        if (cuenta.getServicios() != null) {
            dto.setServicios(
                cuenta.getServicios().stream()
                    .map(servicioMapper::toResponseDTO)
                    .collect(Collectors.toList())
            );
        }
        
        return dto;
    }

    // Cuenta → CuentaSimpleDTO (para usar dentro de Reserva)
    public CuentaSimpleDTO toCuentaSimpleDTO(Cuenta cuenta) {
        if (cuenta == null) return null;
        
        CuentaSimpleDTO dto = new CuentaSimpleDTO();
        dto.setId(cuenta.getId());
        dto.setEstado(cuenta.getEstado()); // ✅ AGREGAR ESTADO AL DTO SIMPLIFICADO
        dto.setTotal(cuenta.getTotal());
        dto.setSaldo(cuenta.getSaldo());
        
        // Servicios
        if (cuenta.getServicios() != null) {
            dto.setServicios(
                cuenta.getServicios().stream()
                    .map(servicioMapper::toResponseDTO)
                    .collect(Collectors.toList())
            );
        }
        
        return dto;
    }
}