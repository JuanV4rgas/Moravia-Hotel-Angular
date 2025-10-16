package com.moravia.demo.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteSimpleDTO {
    private Long idUsuario;
    private String nombre;
    private String apellido;
    private String email;
}