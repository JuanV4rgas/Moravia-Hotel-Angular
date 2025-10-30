package com.moravia.demo.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservaSimpleDTO {
    private Integer id;
    private String fechaInicio;  // LocalDate como String (yyyy-MM-dd)
    private String fechaFin;
    private String estado;
    // ⚠️ NO incluye 'cliente', 'rooms', ni 'cuenta' para evitar loop
}