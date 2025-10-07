package com.moravia.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idServicio;

    private String nombre;
    private String descripcion;
    private Double precio;
    private String imagenUrl;
}
