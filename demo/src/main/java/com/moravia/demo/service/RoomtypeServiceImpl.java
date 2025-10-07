package com.moravia.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moravia.demo.model.Roomtype;
import com.moravia.demo.repository.RoomtypeRepository;

@Service
public class RoomtypeServiceImpl implements RoomtypeService {

    @Autowired
    RoomtypeRepository repo;

    @Override
    public Roomtype searchById(String id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public List<Roomtype> searchAll() {
        return repo.findAll();
    }

    @Override
    public void add(Roomtype roomtype) {
        repo.save(roomtype);
    }

    @Override
    public void update(Roomtype roomtype) {
        repo.save(roomtype);
    }

    @Override
    public void deleteById(String id) {
        repo.deleteById(id);
    }
}
