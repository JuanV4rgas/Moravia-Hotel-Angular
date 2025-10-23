package com.moravia.demo.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CuentaSimpleDTO {
    private Long id;
    private String estado;
    private Double total;
    private List<ServicioResponseDTO> servicios;
    // ⚠️ NO incluye 'reserva' para evitar loop
}