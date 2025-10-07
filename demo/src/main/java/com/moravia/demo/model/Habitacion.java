package com.moravia.demo.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Habitacion {
    
    @Id
    @GeneratedValue
    private Long idHabitacion;

    private String nombre;
    
    private String tipo;
    
    private String descripcion;
    
    private float precio;
    
    private String capacidad;
    
    private int numeroCamas;
    
    private String imagenUrl;


    @JsonIgnore
    @OneToMany(mappedBy = "tipo", cascade = jakarta.persistence.CascadeType.ALL)
    private List<Room> rooms = new ArrayList<>(); // Lista de IDs de las rooms asociadas

    // Setter manual que MUTa la lista en lugar de reasignarla
    public void setRooms(List<Room> rooms) {
        this.rooms.clear();
        if (rooms != null) {
            this.rooms.addAll(rooms);
        }
    }

    public List<Room> getRooms() {
        return rooms;
    }

    // (opcional) método auxiliar para añadir/quitar rooms
    public void addRoom(Room r) {
        this.rooms.add(r);
        r.setTipo(this);
    }

    public void removeRoom(Room r) {
        this.rooms.remove(r);
        r.setTipo(null);
    }

    public Habitacion(String nombre, String tipo, String descripcion, float precio, String capacidad, int numeroCamas, String imagenUrl) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.precio = precio;
        this.capacidad = capacidad;
        this.numeroCamas = numeroCamas;
        this.imagenUrl = imagenUrl;
    }
}