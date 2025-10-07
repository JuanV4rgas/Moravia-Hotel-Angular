package com.moravia.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    private String email;
    private String clave;
    private String nombre;
    private String apellido;
    private String cedula;
    private String telefono;
    private String fotoPerfil;
}
