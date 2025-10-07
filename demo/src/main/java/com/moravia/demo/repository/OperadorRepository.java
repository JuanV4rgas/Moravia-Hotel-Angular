package com.moravia.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moravia.demo.model.Operador;

@Repository
public interface OperadorRepository extends JpaRepository<Operador, Long>{
    
}
