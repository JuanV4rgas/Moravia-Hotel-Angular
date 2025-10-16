package com.moravia.demo.mapper;

import com.moravia.demo.dto.response.ServicioResponseDTO;
import com.moravia.demo.model.Servicio;
import org.springframework.stereotype.Component;

@Component
public class ServicioMapper {

    public ServicioResponseDTO toResponseDTO(Servicio servicio) {
        if (servicio == null) return null;
        
        return new ServicioResponseDTO(
            servicio.getIdServicio(),
            servicio.getNombre(),
            servicio.getDescripcion(),
            servicio.getPrecio(),
            servicio.getImagenUrl()
        );
    }
}