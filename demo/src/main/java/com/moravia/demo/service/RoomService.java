package com.moravia.demo.service;

import java.util.List;

import com.moravia.demo.model.Room;

public interface RoomService {
    public List<Room> findAll();
    
    public Room findById(Long id);
    
    public void add(Room room);

    public void update(Room room);
    
    public void deleteById(Long id);
}
