package com.moravia.demo.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moravia.demo.model.Servicio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas de integración para el ServicioController.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ServicioControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private Servicio servicioEjemplo;

    @BeforeEach
    void setup() {
        servicioEjemplo = new Servicio();
        servicioEjemplo.setNombre("Spa Premium");
        servicioEjemplo.setDescripcion("Acceso completo al spa y sauna");
        servicioEjemplo.setPrecio(79.99);
        servicioEjemplo.setImagenUrl("https://ejemplo.com/spa.jpg");
    }

    @Test
    @DisplayName("POST /servicio/add → crea un servicio")
    void testCrearServicio() throws Exception {
        mockMvc.perform(post("/servicio/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(servicioEjemplo)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /servicio/all → devuelve lista de servicios")
    void testListarServicios() throws Exception {
        mockMvc.perform(get("/servicio/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("GET /servicio/find/{id} → devuelve servicio por id")
    void testBuscarPorId() throws Exception {
        // Crear primero un servicio
        MvcResult result = mockMvc.perform(post("/servicio/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(servicioEjemplo)))
                .andExpect(status().isOk())
                .andReturn();

        // Buscar el último id insertado
        MvcResult listResult = mockMvc.perform(get("/servicio/all"))
                .andExpect(status().isOk())
                .andReturn();

        Servicio[] lista = objectMapper.readValue(listResult.getResponse().getContentAsString(), Servicio[].class);
        Long id = lista[lista.length - 1].getIdServicio();

        // Buscar por id
        mockMvc.perform(get("/servicio/find/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Spa Premium"));
    }

    @Test
    @DisplayName("POST /servicio/update/{id} → actualiza un servicio existente")
    void testActualizarServicio() throws Exception {
        // Crear servicio
        mockMvc.perform(post("/servicio/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(servicioEjemplo)))
                .andExpect(status().isOk());

        // Obtener id del último
        MvcResult listResult = mockMvc.perform(get("/servicio/all"))
                .andExpect(status().isOk())
                .andReturn();
        Servicio[] lista = objectMapper.readValue(listResult.getResponse().getContentAsString(), Servicio[].class);
        Long id = lista[lista.length - 1].getIdServicio();

        // Actualizar
        servicioEjemplo.setDescripcion("Servicio actualizado de spa y sauna");
        mockMvc.perform(post("/servicio/update/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(servicioEjemplo)))
                .andExpect(status().isOk());

        // Verificar cambio
        MvcResult findResult = mockMvc.perform(get("/servicio/find/{id}", id))
                .andExpect(status().isOk())
                .andReturn();
        Servicio actualizado = objectMapper.readValue(findResult.getResponse().getContentAsString(), Servicio.class);
        assertThat(actualizado.getDescripcion()).contains("actualizado");
    }

    @Test
    @DisplayName("DELETE /servicio/delete/{id} → elimina servicio existente")
    void testEliminarServicio() throws Exception {
        // Crear servicio
        mockMvc.perform(post("/servicio/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(servicioEjemplo)))
                .andExpect(status().isOk());

        // Obtener id
        MvcResult listResult = mockMvc.perform(get("/servicio/all"))
                .andReturn();
        Servicio[] lista = objectMapper.readValue(listResult.getResponse().getContentAsString(), Servicio[].class);
        Long id = lista[lista.length - 1].getIdServicio();

        // Eliminar
        mockMvc.perform(delete("/servicio/delete/{id}", id))
                .andExpect(status().isOk());

        // Confirmar borrado
        mockMvc.perform(get("/servicio/find/{id}", id))
                .andExpect(status().isOk())
                .andExpect(content().string(""));
    }
}
