package com.moravia.demo.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarUsuarioRequestDTO {
    private String email;
    private String clave;  // Opcional
    private String nombre;
    private String apellido;
    private String cedula;
    private String telefono;
    private String fotoPerfil;
    private String tipo;
}