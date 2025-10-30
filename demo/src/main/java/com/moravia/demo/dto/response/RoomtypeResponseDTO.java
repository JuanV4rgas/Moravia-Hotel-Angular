package com.moravia.demo.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomtypeResponseDTO {
    private Integer id;
    private String name;
    private String description;
    private Double price;
    private String capacity;
    private Integer numberOfBeds;
    private String image;
    private String type;
    // ⚠️ NO incluye 'rooms' para evitar loop
}