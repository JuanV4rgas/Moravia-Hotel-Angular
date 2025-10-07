package com.moravia.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.moravia.demo.model.Usuario;
import com.moravia.demo.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // ============================================================
    // GET http://localhost:8081/usuarios
    // ➜ Devuelve la lista completa de usuarios
    // ============================================================
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.findAll();
    }

    // ============================================================
    // GET http://localhost:8081/usuarios/{idUsuario}
    // ➜ Devuelve un usuario específico según su ID
    // Ejemplo: http://localhost:8081/usuarios/5
    // ============================================================
    @GetMapping("/{idUsuario}")
    public Usuario obtenerUsuario(@PathVariable Long idUsuario) {
        return usuarioService.findById(idUsuario);
    }

    // ============================================================
    // POST http://localhost:8081/usuarios
    // ➜ Crea un nuevo usuario
    // Ejemplo de JSON:
    // {
    //   "nombre": "Carlos",
    //   "apellido": "Moreno",
    //   "email": "carlos@demo.com",
    //   "clave": "123456",
    //   "telefono": "3001234567",
    //   "cedula": "1023456789",
    //   "fotoPerfil": "foto.jpg"
    // }
    // ============================================================
    @PostMapping
    public void crearUsuario(@RequestBody Usuario usuario) {
        usuarioService.add(usuario);
    }

    // ============================================================
    // PUT http://localhost:8081/usuarios/{idUsuario}
    // ➜ Actualiza un usuario existente según su ID
    // Ejemplo: http://localhost:8081/usuarios/5
    // ============================================================
    @PutMapping("/{idUsuario}")
    public void actualizarUsuario(@PathVariable Long idUsuario, @RequestBody Usuario usuario) {
        usuario.setIdUsuario(idUsuario);
        usuarioService.update(usuario);
    }

    // ============================================================
    // DELETE http://localhost:8081/usuarios/{idUsuario}
    // ➜ Elimina un usuario por su ID
    // Ejemplo: http://localhost:8081/usuarios/5
    // ============================================================
    @DeleteMapping("/{idUsuario}")
    public void eliminarUsuario(@PathVariable Long idUsuario) {
        usuarioService.deleteById(idUsuario);
    }

    // ============================================================
    // GET http://localhost:8081/usuarios/email/{email}
    // ➜ Busca un usuario por su email
    // Ejemplo: http://localhost:8081/usuarios/email/carlos@demo.com
    // ============================================================
    @GetMapping("/email/{email}")
    public Usuario obtenerUsuarioPorEmail(@PathVariable String email) {
        return usuarioService.findByEmail(email);
    }

    // ============================================================
    // POST http://localhost:8081/usuarios/validar
    // ➜ Valida las credenciales de un usuario
    // Body esperado:
    // {
    //   "email": "carlos@demo.com",
    //   "clave": "123456"
    // }
    // ============================================================
    @PostMapping("/validar")
    public boolean validarCredenciales(@RequestBody Usuario usuario) {
        return usuarioService.validarCredenciales(usuario.getEmail(), usuario.getClave());
    }
}
