package com.moravia.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.moravia.demo.model.Reserva;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
}
