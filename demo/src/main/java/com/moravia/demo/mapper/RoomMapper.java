package com.moravia.demo.mapper;

import com.moravia.demo.dto.response.RoomSimpleDTO;
import com.moravia.demo.model.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RoomMapper {

    @Autowired
    private RoomtypeMapper roomtypeMapper;

    public RoomSimpleDTO toSimpleDTO(Room room) {
        if (room == null) return null;
        
        return new RoomSimpleDTO(
            room.getId(),
            room.getHabitacionNumber(),
            room.getAvailable(),
            roomtypeMapper.toResponseDTO(room.getType())
        );
    }
}