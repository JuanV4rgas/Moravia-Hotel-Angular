package com.moravia.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moravia.demo.model.Administrador;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Long>{
    
}

