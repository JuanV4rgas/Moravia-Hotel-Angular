package com.moravia.demo.service;

import java.time.LocalDate;
import java.util.List;
import com.moravia.demo.model.Room;

public interface RoomService {

    List<Room> searchAll();
    Room searchById(Integer id);
    void add(Room room);
    void update(Room room);
    void deleteById(Integer id);

    List<Room> findAvailableRoomsByTypeAndDate(Integer typeId, LocalDate inicio, LocalDate fin);
}
