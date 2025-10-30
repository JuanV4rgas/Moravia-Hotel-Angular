package com.moravia.demo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moravia.demo.model.Room;
import com.moravia.demo.model.Roomtype;
import com.moravia.demo.service.RoomService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RoomController.class)
class RoomControllerTest {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper mapper;

    @MockBean private RoomService roomService;

    // --------- helpers ---------
    private Roomtype rt(String name) {
        Roomtype t = new Roomtype();
        try { t.setName(name); } catch (NoSuchMethodError ignored) {}
        return t;
    }

    private Room room(Integer id, String num, boolean available, Roomtype type) {
        Room r = new Room();
        r.setId(id);
        r.setHabitacionNumber(num);
        r.setAvailable(available);
        r.setType(type);
        return r;
    }

    // 1) GET /room/all
    @Test
    void RoomController_getAll_returnsList() throws Exception {
        var r1 = room(1, "101", true,  rt("Suite"));
        var r2 = room(2, "102", false, rt("Suite"));
        given(roomService.searchAll()).willReturn(List.of(r1, r2));

        mvc.perform(get("/room/all"))
           .andExpect(status().isOk())
           .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
           .andExpect(jsonPath("$", hasSize(2)))
           .andExpect(jsonPath("$[0].habitacionNumber").value("101"))
           .andExpect(jsonPath("$[1].available").value(false));
    }

    // 2) GET /room/find/{id}
    @Test
    void RoomController_getById_found_returnsRoom() throws Exception {
        var r = room(6, "302", true, rt("Suite Real"));
        given(roomService.searchById(6)).willReturn(r);

        mvc.perform(get("/room/find/{id}", 6))
           .andExpect(status().isOk())
           .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
           .andExpect(jsonPath("$.id").value(6))
           .andExpect(jsonPath("$.habitacionNumber").value("302"))
           .andExpect(jsonPath("$.available").value(true));
    }

    // 3) POST /room/add
    @Test
    void RoomController_add_callsServiceWithBody() throws Exception {
        Map<String, Object> payload = Map.of(
            "habitacionNumber", "303",
            "available", true,
            "type", Map.of("id", 2, "name", "Suite Real")
        );

        // Evitar ambigüedad de any(): usar el de Mockito de forma calificada
        doNothing().when(roomService).add(org.mockito.ArgumentMatchers.any(Room.class));

        mvc.perform(post("/room/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(payload)))
           .andExpect(status().isOk());

        ArgumentCaptor<Room> captor = ArgumentCaptor.forClass(Room.class);
        verify(roomService, times(1)).add(captor.capture());
        Room passed = captor.getValue();

        // asserts sobre el objeto que llegó al servicio
        org.assertj.core.api.Assertions.assertThat(passed.getHabitacionNumber()).isEqualTo("303");
        org.assertj.core.api.Assertions.assertThat(passed.getAvailable()).isTrue();
        org.assertj.core.api.Assertions.assertThat(passed.getType()).isNotNull();
        // Nota: no afirmamos sobre type.id para no depender de setters específicos del modelo
    }

    // 4) DELETE /room/delete/{id}
    @Test
    void RoomController_delete_callsServiceDeleteById() throws Exception {
        doNothing().when(roomService).deleteById(6);

        mvc.perform(delete("/room/delete/{id}", 6))
           .andExpect(status().isOk());

        verify(roomService, times(1)).deleteById(6);
    }

    // 5) PUT /room/update/{id}
    @Test
    void RoomController_update_overridesIdFromPath_andCallsServiceUpdate() throws Exception {
        // En el body simulamos un id diferente; el controller debe sobreescribirlo con el del path
        Map<String, Object> payload = Map.of(
            "id", 999, // será ignorado por el controller
            "habitacionNumber", "888",
            "available", false,
            "type", Map.of("id", 10, "name", "Suite")
        );

        doNothing().when(roomService).update(org.mockito.ArgumentMatchers.any(Room.class));

        mvc.perform(put("/room/update/{id}", 6)
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(payload)))
           .andExpect(status().isOk());

        ArgumentCaptor<Room> captor = ArgumentCaptor.forClass(Room.class);
        verify(roomService, times(1)).update(captor.capture());
        Room passed = captor.getValue();

        // Verifica que el ID usado para actualizar es el del path (6), no el del body (999)
        org.assertj.core.api.Assertions.assertThat(passed.getId()).isEqualTo(6);
        org.assertj.core.api.Assertions.assertThat(passed.getHabitacionNumber()).isEqualTo("888");
        org.assertj.core.api.Assertions.assertThat(passed.getAvailable()).isFalse();
    }
}
