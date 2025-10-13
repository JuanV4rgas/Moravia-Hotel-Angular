package com.moravia.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@Entity
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fechaInicio;
    private String fechaFin;
    private String estado;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    @JsonBackReference
    private Usuario cliente;

    @OneToOne(mappedBy = "reserva")
    @JsonManagedReference
    private Cuenta cuenta;

    @ManyToMany
    @JoinTable(
        name = "reserva_rooms",
        joinColumns = @JoinColumn(name = "reserva_id"),
        inverseJoinColumns = @JoinColumn(name = "room_id")
    )
    private List<Room> rooms;
}
