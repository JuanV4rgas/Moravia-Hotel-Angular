package com.moravia.demo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moravia.demo.model.Servicio;
import com.moravia.demo.service.ServicioService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas UNITARIAS del controlador, usando mocks del ServicioService.
 */
@WebMvcTest(controllers = ServicioController.class)
class ServicioControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ServicioService servicioService; // <- Mock del servicio

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /servicio/all devuelve lista mockeada")
    void testListarServiciosMock() throws Exception {
        List<Servicio> lista = Arrays.asList(
                new Servicio(1L, "Spa", "Desc 1", 80.0, "img1.jpg"),
                new Servicio(2L, "Masaje", "Desc 2", 100.0, "img2.jpg")
        );

        Mockito.when(servicioService.findAllServicios()).thenReturn(lista);

        mockMvc.perform(get("/servicio/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].nombre").value("Spa"))
                .andExpect(jsonPath("$[1].precio").value(100.0));
    }

    @Test
    @DisplayName("GET /servicio/find/{id} devuelve servicio mockeado")
    void testBuscarPorIdMock() throws Exception {
        Servicio mockServicio = new Servicio(5L, "Gimnasio", "Acceso total", 49.99, "img5.jpg");

        Mockito.when(servicioService.findServicioById(5L)).thenReturn(Optional.of(mockServicio));

        mockMvc.perform(get("/servicio/find/{id}", 5L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Gimnasio"))
                .andExpect(jsonPath("$.precio").value(49.99));
    }

    @Test
    @DisplayName("POST /servicio/add crea servicio (mockeado)")
    void testAgregarServicioMock() throws Exception {
        Servicio nuevo = new Servicio(null, "Jacuzzi", "Relax", 60.0, "jacuzzi.jpg");
        Servicio guardado = new Servicio(10L, "Jacuzzi", "Relax", 60.0, "jacuzzi.jpg");

        Mockito.when(servicioService.addServicio(any(Servicio.class))).thenReturn(guardado);

        mockMvc.perform(post("/servicio/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nuevo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idServicio").value(10))
                .andExpect(jsonPath("$.nombre").value("Jacuzzi"));
    }

    @Test
    @DisplayName("POST /servicio/update/{id} actualiza servicio (mockeado)")
    void testActualizarServicioMock() throws Exception {
        Servicio actualizado = new Servicio(7L, "Spa Deluxe", "Versión mejorada", 120.0, "spa-deluxe.jpg");

        Mockito.when(servicioService.updateServicio(eq(7L), any(Servicio.class)))
                .thenReturn(Optional.of(actualizado));

        mockMvc.perform(post("/servicio/update/{id}", 7L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(actualizado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Spa Deluxe"))
                .andExpect(jsonPath("$.precio").value(120.0));
    }

    @Test
    @DisplayName("DELETE /servicio/delete/{id} borra servicio (mockeado)")
    void testEliminarServicioMock() throws Exception {
        Mockito.doNothing().when(servicioService).deleteServicio(3L);

        mockMvc.perform(delete("/servicio/delete/{id}", 3L))
                .andExpect(status().isOk());
    }
}
