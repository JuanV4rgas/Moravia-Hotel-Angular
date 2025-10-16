package com.moravia.demo.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarCuentaRequestDTO {
    private String estado;
    private Double total;
    private List<Long> servicioIds;
}