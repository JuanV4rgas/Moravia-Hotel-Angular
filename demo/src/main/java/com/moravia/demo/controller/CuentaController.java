package com.moravia.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.moravia.demo.dto.request.ActualizarCuentaRequestDTO;
import com.moravia.demo.dto.request.CrearCuentaRequestDTO;
import com.moravia.demo.dto.response.CuentaResponseDTO;
import com.moravia.demo.mapper.CuentaMapper;
import com.moravia.demo.mapper.CuentaRequestMapper;
import com.moravia.demo.model.Cuenta;
import com.moravia.demo.service.CuentaService;

@RestController
@RequestMapping("/cuenta")
@CrossOrigin(origins = "http://localhost:4200")
public class CuentaController {

    @Autowired
    private CuentaService cuentaService;
    
    @Autowired
    private CuentaMapper cuentaMapper;

    @Autowired
    private CuentaRequestMapper cuentaRequestMapper;

    @GetMapping("/all")
    public List<CuentaResponseDTO> mostrarCuentas() {
        List<Cuenta> cuentas = cuentaService.searchAll();
        return cuentas.stream()
            .map(cuentaMapper::toResponseDTO)
            .collect(Collectors.toList());
    }

    @GetMapping("/find/{id}")
    public CuentaResponseDTO mostrarCuenta(@PathVariable("id") Long id) {
        Cuenta cuenta = cuentaService.searchById(id);
        return cuentaMapper.toResponseDTO(cuenta);
    }

    @PostMapping("/add")
    public CuentaResponseDTO agregarCuenta(@RequestBody CrearCuentaRequestDTO requestDTO) {
        Cuenta cuenta = cuentaRequestMapper.toEntity(requestDTO);
        cuentaService.add(cuenta);
        return cuentaMapper.toResponseDTO(cuenta);
    }

    // CORREGIDO: Ahora actualiza correctamente los servicios
    @PostMapping("/update/{id}")
    public CuentaResponseDTO actualizarCuenta(
            @RequestBody ActualizarCuentaRequestDTO requestDTO,
            @PathVariable("id") Long id) {
        
        Cuenta cuenta = cuentaService.searchById(id);
        
        if (cuenta == null) {
            throw new RuntimeException("Cuenta no encontrada con ID: " + id);
        }
        
        // Actualizar la cuenta con el mapper
        cuentaRequestMapper.updateEntity(cuenta, requestDTO);
        
        // Guardar cambios
        cuentaService.update(cuenta);
        
        // Retornar la cuenta actualizada
        return cuentaMapper.toResponseDTO(cuenta);
    }
}