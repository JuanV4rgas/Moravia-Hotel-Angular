package com.moravia.demo.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearReservaRequestDTO {
    private String fechaInicio;  // yyyy-MM-dd
    private String fechaFin;
    private String estado;
    private Long clienteId;
    private List<Integer> roomIds;  // Solo IDs de las habitaciones
}