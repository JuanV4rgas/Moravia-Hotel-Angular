package com.moravia.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.moravia.demo.model.Usuario;
import com.moravia.demo.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/usuario")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

    @Autowired
    UsuarioService usuarioService;

    // http://localhost:8081/usuario/all
    @GetMapping("/all")
    @Operation(summary = "Encuentra todos los usuarios")
    public List<Usuario> mostrarUsuarios() {
        return usuarioService.searchAll();
    }

    // http://localhost:8081/usuario/find?id=1
    @GetMapping("/find")
    public Usuario mostrarUsuario(@RequestParam("id") Long id) {
        return usuarioService.searchById(id);
    }

    // http://localhost:8081/usuario/find/1
    @GetMapping("/find/id")
    public Usuario mostrarUsuarioPorId(@RequestParam("id") Long id) {
    return usuarioService.searchById(id);
}


    // http://localhost:8081/usuario/add
    @PostMapping("/add")
    public void agregarUsuario(@RequestBody Usuario usuario) {
        usuarioService.add(usuario);
    }

    // http://localhost:8081/usuario/delete/1
    @DeleteMapping("/delete/{id}")
    public void eliminarUsuario(@PathVariable("id") Long id) {
        usuarioService.deleteById(id);
    }

    // http://localhost:8081/usuario/update/1
    @PostMapping("/update/{id}")
    public void actualizarUsuario(@RequestBody Usuario usuario, @PathVariable("id") Long id) {
        usuario.setIdUsuario(id);
        usuarioService.update(usuario);
    }


    //http://localhost:8081/usuario/find/email?email=juan@mail.com
    @GetMapping("/find/email")
    public Usuario mostrarUsuarioPorEmail(@RequestParam("email") String email) {
        return usuarioService.searchByEmail(email);
    }
}
