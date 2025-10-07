package com.moravia.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Roomtype {

    @Id
    private String id;

    private String name;
    private String description;
    private Double price;
    private String capacity;
    private Integer numberOfBeds;
    private String image;
    private String type;
}
