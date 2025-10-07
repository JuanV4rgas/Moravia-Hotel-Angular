package com.moravia.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

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
    private Cliente cliente;

    @OneToOne(mappedBy = "reserva", cascade = CascadeType.ALL)
    private Cuenta cuenta;

    @ManyToMany
    @JoinTable(
        name = "reserva_rooms",
        joinColumns = @JoinColumn(name = "reserva_id"),
        inverseJoinColumns = @JoinColumn(name = "room_id")
    )
    private List<Room> rooms;
}
