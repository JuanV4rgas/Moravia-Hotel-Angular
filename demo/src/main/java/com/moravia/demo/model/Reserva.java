package com.moravia.demo.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private int cantPersonas;
    private String estado;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    
    @OneToOne(mappedBy = "reserva")
    private Cuenta cuenta;

    public Reserva(LocalDate fechaInicio, LocalDate fechaFin, int cantPersonas, String estado, Cliente cliente,
            Room room) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.cantPersonas = cantPersonas;
        this.estado = estado;
        this.cliente = cliente;
        this.room = room;
    }
}
