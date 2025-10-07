package com.moravia.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Servicio {
    
    @Id
    @GeneratedValue
    private Long idServicio;
    
    private String nombre;
    
    private String descripcion;
    
    private float precio;
    
    private String imagenUrl;

    public Servicio(String nombre, String descripcion, float precio, String imagenUrl) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagenUrl = imagenUrl;
    }
}