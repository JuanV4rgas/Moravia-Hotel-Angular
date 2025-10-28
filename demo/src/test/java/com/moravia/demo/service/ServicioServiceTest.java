package com.moravia.demo.service;

import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import com.moravia.demo.model.Servicio;
import com.moravia.demo.repository.ServicioRepository;

@DataJpaTest
@Import(ServicioServiceImpl.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class ServicioServiceTest {

    @Autowired
    private ServicioService servicioService;

    @Autowired
    private ServicioRepository servicioRepository;

    // helper
    private Servicio build(String nombre, String descripcion, Double precio, String imagenUrl) {
        Servicio s = new Servicio();
        s.setNombre(nombre);
        s.setDescripcion(descripcion);
        s.setPrecio(precio);
        s.setImagenUrl(imagenUrl);
        return s;
    }

    @BeforeEach
    void clean() {
        servicioRepository.deleteAll();
    }

    @Test
    void ServicioService_searchAll_NotEmptyList() {
        // arrange
        servicioService.add(build("Spa", "Acceso al spa", 100.0, "img1"));
        servicioService.add(build("Desayuno", "Buffet americano", 30.0, "img2"));

        // act
        List<Servicio> servicios = servicioService.searchAll();

        // assert
        Assertions.assertThat(servicios).isNotNull();
        Assertions.assertThat(servicios.size()).isGreaterThan(0);
        Assertions.assertThat(servicios).extracting(Servicio::getNombre)
                .contains("Spa", "Desayuno");
    }

    @Test
    void ServicioService_add_AssignsId() {
        // arrange
        Servicio servicio = build("Transporte", "Aeropuerto-Hotel", 45.0, "img3");

        // act
        servicioService.add(servicio);
        Servicio saved = servicioService.searchAll().stream()
                .filter(s -> "Transporte".equals(s.getNombre()))
                .findFirst().orElse(null);

        // assert
        Assertions.assertThat(saved).isNotNull();
        Assertions.assertThat(saved.getIdServicio()).isNotNull();
    }

    @Test
    void ServicioService_searchById_Found() {
        // arrange
        servicioService.add(build("Lavandería", "Lavado y planchado", 15.0, "img4"));
        Long id = servicioService.searchAll().stream()
                .filter(s -> "Lavandería".equals(s.getNombre()))
                .map(Servicio::getIdServicio)
                .findFirst().orElseThrow();

        // act
        Servicio encontrado = servicioService.searchById(id);

        // assert
        Assertions.assertThat(encontrado).isNotNull();
        Assertions.assertThat(encontrado.getNombre()).isEqualTo("Lavandería");
    }

    @Test
    void ServicioService_searchById_WrongId_ReturnsNull() {
        // arrange
        Long id = -11L;

        // act
        Servicio servicio = servicioService.searchById(id);

        // assert
        Assertions.assertThat(servicio).isNull();
    }

    @Test
    void ServicioService_update_ChangesPersisted() {
        // arrange
        servicioService.add(build("Parqueadero", "Cubierto", 10.0, "img5"));
        Servicio s = servicioService.searchAll().stream()
                .filter(x -> "Parqueadero".equals(x.getNombre()))
                .findFirst().orElseThrow();

        // act
        s.setNombre("Parqueadero VIP");
        s.setPrecio(12.5);
        servicioService.update(s);
        Servicio updated = servicioService.searchById(s.getIdServicio());

        // assert
        Assertions.assertThat(updated).isNotNull();
        Assertions.assertThat(updated.getNombre()).isEqualTo("Parqueadero VIP");
        Assertions.assertThat(updated.getPrecio()).isEqualTo(12.5);
    }

    @Test
    void ServicioService_deleteById_RemovesEntity() {
        // arrange
        servicioService.add(build("Gimnasio", "24/7", 0.0, "img6"));
        Long id = servicioService.searchAll().stream()
                .filter(s -> "Gimnasio".equals(s.getNombre()))
                .map(Servicio::getIdServicio)
                .findFirst().orElseThrow();

        // act
        servicioService.deleteById(id);

        // assert
        Assertions.assertThat(servicioService.searchById(id)).isNull();
        Assertions.assertThat(servicioService.searchAll()).extracting(Servicio::getNombre)
                .doesNotContain("Gimnasio");
    }
}
