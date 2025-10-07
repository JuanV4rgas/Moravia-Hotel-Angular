package com.moravia.demo.config;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.moravia.demo.model.Usuario;

import jakarta.servlet.http.HttpSession;

/**
 * ControllerAdvice global que añade automáticamente
 * información de autenticación a todos los modelos de vista
 * 
 * Esto significa que TODAS las vistas tendrán acceso a:
 * - ${authenticated}: boolean que indica si hay usuario logueado
 * - ${usuario}: objeto Usuario con los datos del usuario logueado (o null)
 */
@ControllerAdvice
public class GlobalControllerAdvice {
    
    @ModelAttribute("authenticated")
    public Boolean addAuthenticatedAttribute(HttpSession session) {
        Boolean authenticated = (Boolean) session.getAttribute("authenticated");
        return authenticated != null ? authenticated : false;
    }
    
    @ModelAttribute("usuario")
    public Usuario addUsuarioAttribute(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        return usuario; // Puede ser null, y eso está bien
    }
}