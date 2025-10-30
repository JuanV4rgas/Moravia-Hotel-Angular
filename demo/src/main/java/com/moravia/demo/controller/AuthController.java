package com.moravia.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;

import com.moravia.demo.model.Usuario;
import com.moravia.demo.service.UsuarioService;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;

@Controller
public class AuthController {

  @Autowired
  private UsuarioService usuarioService;

  @GetMapping("/login")
  public String login() {
    return "login"; // resolve a templates/login.html
  }

  /**
   * Login: busca usuario por email y valida contraseña
   * 
   * Redirige a la landing page con parámetro de autenticación si el usuario existe y la contraseña es correcta
   * Redirige a la misma página con parámetro de error si el usuario no existe o la contraseña es incorrecta
   * Redirige a la misma página con parámetro de error si ocurre un error al buscar el usuario
   * 
   * @param email el email del usuario a buscar
   * @param clave la contraseña del usuario a buscar
   * @param model el modelo de la vista que se utilizará para mostrar el formulario de login
   * @param session la sesión HTTP actual
   * @return un string que indica la página a la que se debe redirigir
   */
  @PostMapping("/login")
  public String login(@RequestParam String email, @RequestParam String clave,
      Model model, HttpSession session) {
    try {
      Usuario usuario = usuarioService.searchByEmail(email);
      if (usuario != null) {
        if (usuario.getClave().equals(clave)) {
          // Guardar usuario en sesión
          session.setAttribute("usuario", usuario);
          session.setAttribute("authenticated", true);

          // Redirigir a la landing page con parámetro de autenticación
          return "redirect:/?auth=true";
        } else {
          model.addAttribute("error", "Clave incorrecta");
          return "login";
        }
      } else {
        return "redirect:/login?error=Usuario+no+encontrado";
      }
    } catch (Exception e) {
      return "redirect:/login?error=Error+al+cargar+el+usuario";
    }
  }

/**
 * Cierra la sesión actual y redirige a la página principal con parámetro de logout
 * 
 * @param session la sesión HTTP actual
 * @return un string que indica la página a la que se debe redirigir
 */
  @GetMapping("/logout")
  public String logout(HttpSession session) {
    session.invalidate(); // Eliminar toda la sesión
    return "redirect:/?logout=true";
  }
}