package com.moravia.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

import com.moravia.demo.model.Reserva;
import com.moravia.demo.model.Room;
import com.moravia.demo.model.Roomtype;
import com.moravia.demo.model.Usuario;
import com.moravia.demo.repository.ReservaRepository;
import com.moravia.demo.repository.RoomRepository;
import com.moravia.demo.repository.RoomtypeRepository;
import com.moravia.demo.repository.UsuarioRepository;

@DataJpaTest
@Import(RoomServiceImpl.class)
class RoomServiceTest {

    @Autowired private RoomService roomService;
    @Autowired private RoomRepository roomRepository;
    @Autowired private RoomtypeRepository roomtypeRepository;
    @Autowired private ReservaRepository reservaRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private TestEntityManager em; // <-- para flush/clear

    private Roomtype tipo(String name, double price) {
        Roomtype t = new Roomtype();
        t.setName(name);
        t.setPrice(price);
        return roomtypeRepository.save(t);
    }

    private Room room(String num, Roomtype t, boolean available) {
        Room r = new Room();
        r.setHabitacionNumber(num);
        r.setType(t);                 // lado dueño
        r.setAvailable(available);
        return roomRepository.save(r);
    }

    private Usuario cliente(String email) {
        Usuario u = new Usuario();
        u.setEmail(email);
        u.setTipo("cliente");
        u.setNombre("C");
        u.setApellido("T");
        u.setClave("123");
        return usuarioRepository.save(u);
    }

    private Reserva reservar(Usuario c, List<Room> rooms, LocalDate ini, LocalDate fin, String estado) {
        Reserva rv = new Reserva();
        rv.setCliente(c);
        rv.setFechaInicio(ini);
        rv.setFechaFin(fin);
        rv.setEstado(estado);
        rv.setRooms(rooms);
        return reservaRepository.save(rv);
    }

    @Test
    void RoomService_findAvailableRoomsByTypeAndDate_filtraPorTipoYFechas() {
        // arrange
        var tSuite = tipo("Suite", 500);
        var tStd   = tipo("Standard", 200);

        var r101 = room("101", tSuite, true);  // ocupada en el rango
        var r102 = room("102", tSuite, true);  // libre
        room("201", tStd,   true);             // distinto tipo

        var cli  = cliente("c@test.com");
        reservar(cli, List.of(r101), LocalDate.now().plusDays(2), LocalDate.now().plusDays(4), "ACTIVA");

        // Muy importante: asegura que el servicio cargue entidades frescas con colecciones perezosas
        em.flush();
        em.clear();

        // act
        var disponibles = roomService.findAvailableRoomsByTypeAndDate(
                tSuite.getId(),                    // solo tipo Suite
                LocalDate.now().plusDays(3),       // se cruza con r101
                LocalDate.now().plusDays(5)
        );

        // assert
        Assertions.assertThat(disponibles)
                .extracting(Room::getHabitacionNumber)
                .contains("102")
                .doesNotContain("101"); // la 101 está reservada en el rango
    }
}
