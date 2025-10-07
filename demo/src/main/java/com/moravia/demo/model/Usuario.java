package com.moravia.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.validation.constraints.*;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Usuario {

    @Id
    @GeneratedValue
    private Long idUsuario;
    
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El formato del correo no es válido")
    private String email;
    
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String clave;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    private String nombre;
    
    @NotBlank(message = "El apellido es obligatorio")
    @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    private String apellido;
    
    @NotBlank(message = "La cédula es obligatoria")
    @Pattern(regexp = "^[0-9]{7,10}$", message = "La cédula debe tener entre 7 y 10 dígitos")
    private String cedula;
    
    @Pattern(regexp = "^[+]?[0-9\\s\\-()]+$", message = "El formato del teléfono no es válido")
    private String telefono;
    
    private String fotoPerfil;

    public Usuario(String email, String clave, String nombre, String apellido, String cedula, String telefono, String fotoPerfil) {
        this.email = email;
        this.clave = clave;
        this.nombre = nombre;
        this.apellido = apellido;
        this.cedula = cedula;
        this.telefono = telefono;
        this.fotoPerfil = fotoPerfil;
    }
}