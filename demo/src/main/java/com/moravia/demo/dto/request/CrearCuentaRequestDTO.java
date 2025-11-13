package com.moravia.demo.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearCuentaRequestDTO {
    private String estado;
    private Double total;
    private Double saldo;
    private Integer reservaId;
    private List<Long> servicioIds;
}