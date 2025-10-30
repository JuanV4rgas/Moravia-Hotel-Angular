package com.moravia.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
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
@Import(ReservaServiceImpl.class)
class ReservaServiceTest {

    @Autowired private ReservaService reservaService;
    @Autowired private RoomRepository roomRepository;
    @Autowired private RoomtypeRepository roomtypeRepository;
    @Autowired private ReservaRepository reservaRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    private Roomtype tipo(String name, double price) {
        Roomtype t = new Roomtype();
        t.setName(name);
        t.setPrice(price);
        return roomtypeRepository.save(t);
    }

    private Room room(String num, Roomtype t, boolean available) {
        Room r = new Room();
        r.setHabitacionNumber(num);
        r.setType(t);
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

    private void reservar(Usuario c, List<Room> rooms, LocalDate ini, LocalDate fin, String estado) {
        Reserva rv = new Reserva();
        rv.setCliente(c);
        rv.setFechaInicio(ini);
        rv.setFechaFin(fin);
        rv.setEstado(estado);
        rv.setRooms(rooms);
        reservaRepository.save(rv);
    }

    @Test
    void ReservaService_buscarHabitacionesDisponibles_devuelveSoloLibres() {
        // arrange
        var t = tipo("Suite", 1000);
        var r1 = room("101", t, true);   // se reserva (ocupada)
        var r2 = room("102", t, true);   // libre
        var cli = cliente("c@test.com");

        reservar(cli, List.of(r1), LocalDate.now().plusDays(1), LocalDate.now().plusDays(3), "ACTIVA");

        // act
        var libres = reservaService.buscarHabitacionesDisponibles(
                LocalDate.now().plusDays(2),   // se cruza con r1
                LocalDate.now().plusDays(4)
        );

        // assert
        Assertions.assertThat(libres)
                .extracting(Room::getHabitacionNumber)
                .contains("102")
                .doesNotContain("101");
    }
}
