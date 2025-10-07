package com.moravia.demo.service;

import java.util.List;
import com.moravia.demo.model.Room;

public interface RoomService {
    public Room searchById(String id);
    public List<Room> searchAll();
    public void add(Room room);
    public void update(Room room);
    public void deleteById(String id);
}
