package com.moravia.demo.mapper;

import com.moravia.demo.dto.response.RoomtypeResponseDTO;
import com.moravia.demo.model.Roomtype;
import org.springframework.stereotype.Component;

@Component
public class RoomtypeMapper {

    public RoomtypeResponseDTO toResponseDTO(Roomtype roomtype) {
        if (roomtype == null) return null;
        
        return new RoomtypeResponseDTO(
            roomtype.getId(),
            roomtype.getName(),
            roomtype.getDescription(),
            roomtype.getPrice(),
            roomtype.getCapacity(),
            roomtype.getNumberOfBeds(),
            roomtype.getImage(),
            roomtype.getType()
        );
    }
}