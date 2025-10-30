package com.moravia.demo.service;

import java.util.List;
import com.moravia.demo.model.Cuenta;

public interface CuentaService {
    public Cuenta searchById(Long id);
    public List<Cuenta> searchAll();
    public void add(Cuenta cuenta);
    public void update(Cuenta cuenta);
    public void deleteById(Long id);
}
