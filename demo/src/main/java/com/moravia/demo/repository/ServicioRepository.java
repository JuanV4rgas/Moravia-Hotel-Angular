package com.moravia.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moravia.demo.model.Servicio;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Long> {


}
