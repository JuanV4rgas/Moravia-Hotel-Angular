package com.moravia.demo.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioConReservasDTO {
    private Long idUsuario;
    private String email;
    private String nombre;
    private String apellido;
    private String cedula;
    private String telefono;
    private String fotoPerfil;
    private String tipo;
    private List<ReservaSimpleDTO> reservas;  // ✅ Reservas simplificadas (sin cliente)
}