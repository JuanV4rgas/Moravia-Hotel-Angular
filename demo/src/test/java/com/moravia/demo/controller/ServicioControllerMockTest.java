package com.moravia.demo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moravia.demo.model.Servicio;
import com.moravia.demo.service.ServicioService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.List;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas UNITARIAS del controlador con el Servicio mockeado.
 * Métodos reales del Servicio:
 *  - searchAll(), searchById(Long), add(Servicio), update(Servicio), deleteById(Long)
 */
@WebMvcTest(controllers = ServicioController.class)
class ServicioControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    /** @apiNote En Spring Boot 3.4 @MockBean está deprecado pero sigue funcionando.
     *  Puedes mantenerlo o migrar más adelante cuando salga el reemplazo estable. */
    @MockBean
    private ServicioService servicioService;

    @Autowired
    private ObjectMapper objectMapper;

    private static Servicio buildServicio(Long id, String nombre, String desc, Double precio, String imagen) {
        Servicio s = new Servicio();           // <- sin constructor args
        s.setIdServicio(id);
        s.setNombre(nombre);
        s.setDescripcion(desc);
        s.setPrecio(precio);
        s.setImagenUrl(imagen);
        return s;
    }

    @Test
    @DisplayName("GET /servicio/all → devuelve lista (mock)")
    void listarServicios() throws Exception {
        List<Servicio> lista = List.of(
                buildServicio(1L, "Spa", "Desc 1", 80.0, "img1.jpg"),
                buildServicio(2L, "Masaje", "Desc 2", 100.0, "img2.jpg")
        );

        when(servicioService.searchAll()).thenReturn(lista);

        mockMvc.perform(get("/servicio/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].nombre").value("Spa"))
                .andExpect(jsonPath("$[1].precio").value(100.0));
    }

    @Test
    @DisplayName("GET /servicio/find/{id} → devuelve uno (mock)")
    void buscarPorId() throws Exception {
        when(servicioService.searchById(5L))
                .thenReturn(buildServicio(5L, "Gimnasio", "Acceso total", 49.99, "img5.jpg"));

        mockMvc.perform(get("/servicio/find/{id}", 5L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idServicio").value(5))
                .andExpect(jsonPath("$.nombre").value("Gimnasio"))
                .andExpect(jsonPath("$.precio").value(49.99));
    }

    @Test
    @DisplayName("POST /servicio/add → crea (void) y llama a service.add")
    void agregar() throws Exception {
        Servicio nuevo = buildServicio(null, "Jacuzzi", "Relax", 60.0, "jacuzzi.jpg");
        doNothing().when(servicioService).add(any(Servicio.class));

        mockMvc.perform(post("/servicio/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nuevo)))
                .andExpect(status().isOk())          // el controlador devuelve void -> 200 OK sin body
                .andExpect(content().string(isEmptyString()));

        ArgumentCaptor<Servicio> captor = ArgumentCaptor.forClass(Servicio.class);
        verify(servicioService, times(1)).add(captor.capture());
        Servicio enviado = captor.getValue();
        // sanity checks
        org.junit.jupiter.api.Assertions.assertEquals("Jacuzzi", enviado.getNombre());
        org.junit.jupiter.api.Assertions.assertNull(enviado.getIdServicio());
    }

    @Test
    @DisplayName("POST /servicio/update/{id} → actualiza (void) y llama a service.update con el id seteado")
    void actualizar() throws Exception {
        Servicio body = buildServicio(null, "Spa Deluxe", "Mejorado", 120.0, "spa-deluxe.jpg");
        doNothing().when(servicioService).update(any(Servicio.class));

        mockMvc.perform(post("/servicio/update/{id}", 7L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(content().string(isEmptyString()));

        ArgumentCaptor<Servicio> captor = ArgumentCaptor.forClass(Servicio.class);
        verify(servicioService, times(1)).update(captor.capture());
        org.junit.jupiter.api.Assertions.assertEquals(7L, captor.getValue().getIdServicio());
        org.junit.jupiter.api.Assertions.assertEquals("Spa Deluxe", captor.getValue().getNombre());
    }

    @Test
    @DisplayName("DELETE /servicio/delete/{id} → borra (void) y llama a service.deleteById")
    void eliminar() throws Exception {
        doNothing().when(servicioService).deleteById(3L);

        mockMvc.perform(delete("/servicio/delete/{id}", 3L))
                .andExpect(status().isOk())
                .andExpect(content().string(isEmptyString()));

        verify(servicioService, times(1)).deleteById(3L);
    }
}
