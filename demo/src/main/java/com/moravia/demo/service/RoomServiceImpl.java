package com.moravia.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moravia.demo.model.Room;
import com.moravia.demo.repository.RoomRepository;

@Service
public class RoomServiceImpl implements RoomService {

    @Autowired
    RoomRepository repo;

    @Override
    public Room searchById(String id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public List<Room> searchAll() {
        return repo.findAll();
    }

    @Override
    public void add(Room room) {
        repo.save(room);
    }

    @Override
    public void update(Room room) {
        repo.save(room);
    }

    @Override
    public void deleteById(String id) {
        repo.deleteById(id);
    }
}
