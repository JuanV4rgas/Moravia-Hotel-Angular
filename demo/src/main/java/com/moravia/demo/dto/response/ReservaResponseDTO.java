package com.moravia.demo.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservaResponseDTO {
    private Integer id;
    private String fechaInicio;  // LocalDate como String (yyyy-MM-dd)
    private String fechaFin;
    private String estado;
    private ClienteSimpleDTO cliente;      // ✅ Simplificado
    private List<RoomSimpleDTO> rooms;     // ✅ Simplificado
    private CuentaSimpleDTO cuenta;        // ✅ Simplificado
}
