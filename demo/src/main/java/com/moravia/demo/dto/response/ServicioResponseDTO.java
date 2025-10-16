package com.moravia.demo.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServicioResponseDTO {
    private Long idServicio;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String imagenUrl;
}