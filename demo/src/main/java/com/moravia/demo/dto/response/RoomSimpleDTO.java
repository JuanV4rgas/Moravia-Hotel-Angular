package com.moravia.demo.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomSimpleDTO {
    private Integer id;
    private String habitacionNumber;
    private Boolean available;
    private RoomtypeResponseDTO type;
    // ⚠️ NO incluye 'reservas' para evitar loop
}