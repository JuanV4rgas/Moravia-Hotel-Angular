package com.moravia.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.moravia.demo.model.Cuenta;
import com.moravia.demo.service.CuentaService;

@RestController
@RequestMapping("/cuenta")
@CrossOrigin(origins = "http://localhost:4200")
public class CuentaController {

    @Autowired
    CuentaService cuentaService;

    @GetMapping("/all")
    public List<Cuenta> mostrarCuentas() {
        return cuentaService.searchAll();
    }

    @GetMapping("/find/{id}")
    public Cuenta mostrarCuenta(@PathVariable("id") Long id) {
        return cuentaService.searchById(id);
    }

    @PostMapping("/add")
    public void agregarCuenta(@RequestBody Cuenta cuenta) {
        cuentaService.add(cuenta);
    }

    @DeleteMapping("/delete/{id}")
    public void eliminarCuenta(@PathVariable("id") Long id) {
        cuentaService.deleteById(id);
    }

    @PostMapping("/update/{id}")
    public void actualizarCuenta(@RequestBody Cuenta cuenta, @PathVariable("id") Long id) {
        cuenta.setId(id);
        cuentaService.update(cuenta);
    }
}
