package com.moravia.demo.repository;

import java.time.LocalDate;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.moravia.demo.model.Reserva;
import com.moravia.demo.model.Usuario;

@DataJpaTest
class ReservaRepositoryTest {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario nuevoCliente(String email) {
        Usuario u = new Usuario();
        u.setEmail(email);
        u.setTipo("cliente");
        u.setNombre("Cliente");
        u.setApellido("X");
        u.setClave("123");
        return usuarioRepository.save(u);
    }

    private Reserva r(String estado, Usuario cliente, LocalDate ini, LocalDate fin) {
        Reserva x = new Reserva();
        x.setEstado(estado);
        x.setCliente(cliente);
        x.setFechaInicio(ini);
        x.setFechaFin(fin);
        return reservaRepository.save(x);
    }

    @Test
    void ReservaRepository_findReservaActiva_filtraActivas() {
        // arrange
        var cli = nuevoCliente("c@test.com");
        r("ACTIVA",     cli, LocalDate.now(), LocalDate.now().plusDays(2));
        r("CANCELADA",  cli, LocalDate.now().plusDays(5), LocalDate.now().plusDays(7));
        r("FINALIZADA", cli, LocalDate.now().minusDays(10), LocalDate.now().minusDays(8));

        // act
        var activas = reservaRepository.findReservaActiva();

        // assert
        Assertions.assertThat(activas).isNotEmpty();
        Assertions.assertThat(activas)
                .allMatch(res -> "ACTIVA".equals(res.getEstado()));
    }
}
