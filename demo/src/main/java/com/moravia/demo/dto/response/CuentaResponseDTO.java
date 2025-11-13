package com.moravia.demo.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CuentaResponseDTO {
    private Long id;
    private String estado;
    private Double total;
    private Double saldo;
    private ReservaSimpleDTO reserva;  // ✅ Simplificada
    private List<ServicioResponseDTO> servicios;
    // ⚠️ NO incluye referencia completa a Reserva
}