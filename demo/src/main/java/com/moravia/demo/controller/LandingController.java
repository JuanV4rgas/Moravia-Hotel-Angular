package com.moravia.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;

import com.moravia.demo.model.Usuario;
import com.moravia.demo.service.ServicioService;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;

@Controller
public class LandingController {

    @Autowired
    private ServicioService servicioService;

    // http://localhost:8081/
    @GetMapping("/")
    public String landing(
            @RequestParam(value = "auth", required = false) String auth,
            @RequestParam(value = "logout", required = false) String logout,
            Model model,
            HttpSession session) {

        // Verificar si hay usuario autenticado en sesión
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        Boolean authenticated = (Boolean) session.getAttribute("authenticated");

        if (usuario != null && authenticated != null && authenticated) {
            model.addAttribute("authenticated", true);
            model.addAttribute("usuario", usuario);
        } else {
            model.addAttribute("authenticated", false);
        }

        // Manejar mensajes de estado
        if ("true".equals(auth)) {
            model.addAttribute("loginSuccess", true);
        }

        if ("true".equals(logout)) {
            model.addAttribute("logoutSuccess", true);
        }

        //Agregrar la lista de servicios al modelo 
        model.addAttribute("servicios", servicioService.searchAll());

    
        return "index";
    }
}
