package com.moravia.demo.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarReservaRequestDTO {
    private String fechaInicio;
    private String fechaFin;
    private String estado;
    private List<Integer> roomIds;
}