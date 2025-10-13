package com.moravia.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Data
@Entity
public class Cuenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String estado;
    private Double total;

    @OneToOne
    @JoinColumn(name = "id_reserva")
    @JsonBackReference
    private Reserva reserva;

    @ManyToMany
    @JoinTable(
        name = "cuenta_servicios",
        joinColumns = @JoinColumn(name = "cuenta_id"),
        inverseJoinColumns = @JoinColumn(name = "servicio_id")
    )
    private List<Servicio> servicios;
}
