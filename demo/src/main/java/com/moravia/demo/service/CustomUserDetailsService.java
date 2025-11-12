package com.moravia.demo.service;

import com.moravia.demo.model.Usuario;
import com.moravia.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(username);
        if (usuario == null) {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }

        Set<GrantedAuthority> authorities = new HashSet<>();

        if (usuario.getRoles() != null && !usuario.getRoles().isEmpty()) {
            authorities.addAll(
                usuario.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority(role.getName()))
                    .collect(Collectors.toSet())
            );
        } else if (usuario.getTipo() != null) {
            // Fallback: mapear campo tipo (cliente|administrador|operador) a ROLE_*
            String mappedRole = switch (usuario.getTipo().toLowerCase()) {
                case "administrador" -> "ROLE_ADMIN";
                case "operador" -> "ROLE_OPERADOR";
                case "cliente" -> "ROLE_CLIENTE";
                default -> "ROLE_CLIENTE";
            };
            authorities.add(new SimpleGrantedAuthority(mappedRole));
        }

        return new User(usuario.getEmail(), usuario.getClave(), authorities);
    }
}
