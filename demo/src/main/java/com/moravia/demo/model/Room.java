package com.moravia.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Room {

    @Id
    private String id;

    private String habitacionNumber;
    private Boolean available;

    @ManyToOne
    @JoinColumn(name = "roomtype_id")
    private Roomtype type;
}
