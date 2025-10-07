package com.moravia.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.moravia.demo.model.Cliente;
import com.moravia.demo.service.ClienteService;

@RestController
@RequestMapping("/cliente")
@CrossOrigin(origins = "http://localhost:4200")
public class ClienteController {

    @Autowired
    ClienteService clienteService;

    @GetMapping("/all")
    public List<Cliente> mostrarClientes() {
        return clienteService.searchAll();
    }

    @GetMapping("/find/{id}")
    public Cliente mostrarCliente(@PathVariable("id") Long id) {
        return clienteService.searchById(id);
    }

    @PostMapping("/add")
    public void agregarCliente(@RequestBody Cliente cliente) {
        clienteService.add(cliente);
    }

    @DeleteMapping("/delete/{id}")
    public void eliminarCliente(@PathVariable("id") Long id) {
        clienteService.deleteById(id);
    }

    @PostMapping("/update/{id}")
    public void actualizarCliente(@RequestBody Cliente cliente, @PathVariable("id") Long id) {
        cliente.setIdUsuario(id);
        clienteService.update(cliente);
    }
}
