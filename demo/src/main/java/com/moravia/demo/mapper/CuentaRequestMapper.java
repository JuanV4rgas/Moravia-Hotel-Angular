package com.moravia.demo.mapper;

import com.moravia.demo.dto.request.ActualizarCuentaRequestDTO;
import com.moravia.demo.dto.request.CrearCuentaRequestDTO;
import com.moravia.demo.model.Cuenta;
import com.moravia.demo.model.Reserva;
import com.moravia.demo.model.Servicio;
import com.moravia.demo.repository.ReservaRepository;
import com.moravia.demo.repository.ServicioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CuentaRequestMapper {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    public Cuenta toEntity(CrearCuentaRequestDTO dto) {
        if (dto == null) return null;
        
        Cuenta cuenta = new Cuenta();
        cuenta.setEstado(dto.getEstado());
        cuenta.setTotal(dto.getTotal());
        cuenta.setSaldo(dto.getSaldo() != null ? dto.getSaldo() : dto.getTotal()); // Initialize saldo to total if not provided
        
        // Buscar reserva
        if (dto.getReservaId() != null) {
            Reserva reserva = reservaRepository.findById(dto.getReservaId())
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
            cuenta.setReserva(reserva);
        }
        
        // Buscar servicios
        if (dto.getServicioIds() != null && !dto.getServicioIds().isEmpty()) {
            List<Servicio> servicios = dto.getServicioIds().stream()
                .map(id -> servicioRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Servicio no encontrado: " + id)))
                .collect(Collectors.toList());
            cuenta.setServicios(servicios);
        }
        
        return cuenta;
    }

    public void updateEntity(Cuenta cuenta, ActualizarCuentaRequestDTO dto) {
        if (dto.getEstado() != null) {
            cuenta.setEstado(dto.getEstado());
        }
        if (dto.getTotal() != null) {
            cuenta.setTotal(dto.getTotal());
        }
        if (dto.getSaldo() != null) {
            cuenta.setSaldo(dto.getSaldo());
        }
        if (dto.getServicioIds() != null) {
            List<Servicio> servicios = dto.getServicioIds().stream()
                .map(id -> servicioRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Servicio no encontrado: " + id)))
                .collect(Collectors.toList());
            cuenta.setServicios(servicios);
        }
    }
}