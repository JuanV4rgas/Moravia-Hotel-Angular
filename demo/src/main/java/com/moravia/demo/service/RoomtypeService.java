package com.moravia.demo.service;

import java.util.List;
import com.moravia.demo.model.Roomtype;

public interface RoomtypeService {
    public Roomtype searchById(Integer id);
    public List<Roomtype> searchAll();
    public void add(Roomtype roomtype);
    public void update(Roomtype roomtype);
    public void deleteById(Integer id);
}
