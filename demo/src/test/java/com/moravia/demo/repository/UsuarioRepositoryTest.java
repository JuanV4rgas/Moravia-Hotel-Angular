package com.moravia.demo.repository;

import com.moravia.demo.model.Usuario;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario u(String email, String tipo, String nombre) {
        Usuario x = new Usuario();
        x.setEmail(email);
        x.setTipo(tipo);
        x.setNombre(nombre);
        x.setApellido("Test");
        x.setClave("123");
        return x;
    }

    @Test
    void UsuarioRepository_findByEmail_devuelveUsuario() {
        // arrange
        usuarioRepository.save(u("ana@test.com", "cliente", "Ana"));
        usuarioRepository.save(u("admin@test.com", "admin", "Root"));

        // act
        Usuario encontrado = usuarioRepository.findByEmail("ana@test.com");

        // assert
        Assertions.assertThat(encontrado).isNotNull();
        Assertions.assertThat(encontrado.getNombre()).isEqualTo("Ana");
        Assertions.assertThat(encontrado.getTipo()).isEqualTo("cliente");
    }

    @Test
    void UsuarioRepository_findClientes_soloTipoCliente() {
        // arrange
        usuarioRepository.save(u("cli1@test.com", "cliente", "C1"));
        usuarioRepository.save(u("cli2@test.com", "cliente", "C2"));
        usuarioRepository.save(u("ad@test.com",  "admin",   "Admin"));

        // act
        var clientes = usuarioRepository.findClientes();

        // assert
        Assertions.assertThat(clientes).isNotEmpty();
        Assertions.assertThat(clientes)
                .allMatch(c -> "cliente".equals(c.getTipo()))
                .extracting(Usuario::getEmail)
                .contains("cli1@test.com", "cli2@test.com");
    }
}
