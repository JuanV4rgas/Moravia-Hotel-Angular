package com.moravia.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Data
@Entity
public class Roomtype {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;           // Ej: Suite Deluxe
    private String description;
    private Double price;          // Precio base por noche
    private String capacity;       // Ej: 2 personas
    private Integer numberOfBeds;  // Ej: 1 cama King
    private String image;          // URL o nombre de imagen
    private String type;           // Ej: Premium, Estándar, Familiar

    @OneToMany(mappedBy = "type", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Room> rooms;
}
