package com.moravia.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@Entity
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String habitacionNumber;   // Ej: "301", "302"
    private Boolean available = true;  // Por defecto, disponible

    @ManyToOne
    @JoinColumn(name = "roomtype_id")
    @JsonBackReference
    private Roomtype type;

    @ManyToMany(mappedBy = "rooms")
    @JsonManagedReference
    private List<Reserva> reservas;


    // ===============================
    // MÉTODOS DE NEGOCIO
    // ===============================

    public boolean estaDisponibleEn(LocalDate inicio, LocalDate fin) {
        if (!Boolean.TRUE.equals(this.available)) return false;
        if (reservas == null || reservas.isEmpty()) return true;

        // Retorna false si hay reservas que se cruzan con las fechas
        return reservas.stream().noneMatch(r ->
            !(r.getFechaFin().isBefore(inicio) || r.getFechaInicio().isAfter(fin))
        );
    }

    public double getPrecioPorNoche() {
        // Retorna el precio base definido en el Roomtype
        return type != null && type.getPrice() != null ? type.getPrice() : 0.0;
    }
}
