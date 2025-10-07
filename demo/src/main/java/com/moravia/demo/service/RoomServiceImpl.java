package com.moravia.demo.service;

import com.moravia.demo.model.Room;
import com.moravia.demo.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository repo;

    @Override
    public List<Room> findAll() {
        return repo.findAll();
    }

    @Override
    public Room findById(Long id) {
        return repo.findById(id).orElse(null);
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
    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}
