package com.moravia.demo.model;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import jakarta.transaction.Transactional;

import com.moravia.demo.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
@Transactional
public class DatabaseInit implements ApplicationRunner {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private RoomRepository roomRepository;
    @Autowired private RoomtypeRepository roomtypeRepository;
    @Autowired private ServicioRepository servicioRepository;
    @Autowired private ReservaRepository reservaRepository;
    @Autowired private CuentaRepository cuentaRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {

        Random random = new Random(42);

        // ===========================
        // ROLES + USUARIOS (BCrypt)
        // ===========================
        Role rAdmin = roleRepository.findByName("ROLE_ADMIN").orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_ADMIN").build()));
        Role rOperador = roleRepository.findByName("ROLE_OPERADOR").orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_OPERADOR").build()));
        Role rCliente = roleRepository.findByName("ROLE_CLIENTE").orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_CLIENTE").build()));

        usuarioRepository.save(Usuario.builder().email("juan.perez@example.com").clave(passwordEncoder.encode("clave123")).nombre("Juan").apellido("Perez").cedula("1234567890").telefono("3001234567").fotoPerfil("https://randomuser.me/api/portraits/men/1.jpg").tipo("administrador").roles(new java.util.HashSet<>(java.util.List.of(rAdmin))).build());
        usuarioRepository.save(Usuario.builder().email("maria.gomez@example.com").clave(passwordEncoder.encode("pass456")).nombre("Maria").apellido("Gomez").cedula("9876543210").telefono("3012345678").fotoPerfil("https://randomuser.me/api/portraits/women/2.jpg").tipo("cliente").roles(new java.util.HashSet<>(java.util.List.of(rCliente))).build());
        usuarioRepository.save(Usuario.builder().email("carlos.rojas@example.com").clave(passwordEncoder.encode("carlos123")).nombre("Carlos").apellido("Rojas").cedula("1112233445").telefono("3024567890").fotoPerfil("https://randomuser.me/api/portraits/men/3.jpg").tipo("operador").roles(new java.util.HashSet<>(java.util.List.of(rOperador))).build());
        usuarioRepository.save(Usuario.builder().email("laura.martinez@example.com").clave(passwordEncoder.encode("laura456")).nombre("Laura").apellido("Martinez").cedula("5544332211").telefono("3041234567").fotoPerfil("https://randomuser.me/api/portraits/women/4.jpg").tipo("cliente").roles(new java.util.HashSet<>(java.util.List.of(rCliente))).build());
        usuarioRepository.save(Usuario.builder().email("andres.mendoza@example.com").clave(passwordEncoder.encode("andres789")).nombre("Andres").apellido("Mendoza").cedula("1029384756").telefono("3056789123").fotoPerfil("https://randomuser.me/api/portraits/men/5.jpg").tipo("administrador").roles(new java.util.HashSet<>(java.util.List.of(rAdmin))).build());
        usuarioRepository.save(Usuario.builder().email("paola.rivera@example.com").clave(passwordEncoder.encode("paola789")).nombre("Paola").apellido("Rivera").cedula("0192837465").telefono("3065432189").fotoPerfil("https://randomuser.me/api/portraits/women/6.jpg").tipo("operador").roles(new java.util.HashSet<>(java.util.List.of(rOperador))).build());
        usuarioRepository.save(Usuario.builder().email("felipe.sanchez@example.com").clave(passwordEncoder.encode("felipe321")).nombre("Felipe").apellido("Sanchez").cedula("1230984567").telefono("3071112233").fotoPerfil("https://randomuser.me/api/portraits/men/7.jpg").tipo("cliente").roles(new java.util.HashSet<>(java.util.List.of(rCliente))).build());
        usuarioRepository.save(Usuario.builder().email("camila.ortiz@example.com").clave(passwordEncoder.encode("camila654")).nombre("Camila").apellido("Ortiz").cedula("7654321098").telefono("3089988776").fotoPerfil("https://randomuser.me/api/portraits/women/8.jpg").tipo("cliente").roles(new java.util.HashSet<>(java.util.List.of(rCliente))).build());

        List<Usuario> usuarios = usuarioRepository.findAll();

        // ===========================
        // ROOMTYPES
        // ===========================
        roomtypeRepository.save(Roomtype.builder().name("Suite Presidencial").description("Suite de lujo con jacuzzi y mayordomo.").price(1850.0).capacity("2 adultos + 1 nino").numberOfBeds(1).image("https://giessbach.ch/images/image_uploads/GrandhotelGiessbach_%C2%A9DigitaleMassarbeit_269.jpg").type("Suite").build());
        roomtypeRepository.save(Roomtype.builder().name("Suite Real").description("Decoracion clasica, chimenea y terraza.").price(1350.0).capacity("2 adultos").numberOfBeds(1).image("https://giessbach.ch/images/image_uploads/224_Weber-Suite-Wohnzimmer.jpg").type("Suite").build());
        roomtypeRepository.save(Roomtype.builder().name("Junior Suite").description("Elegante con sala de estar separada.").price(890.0).capacity("2 adultos + 1 nino").numberOfBeds(1).image("https://giessbach.ch/images/image_uploads/Suite-Horace-Edouard-Zimmer.jpg").type("Suite").build());
        roomtypeRepository.save(Roomtype.builder().name("Deluxe Panoramica").description("Vistas al centro historico de Praga.").price(520.0).capacity("2 adultos").numberOfBeds(1).image("https://giessbach.ch/images/image_uploads/_zimmer/Suite-von-Rappard-Wohnecke.jpg").type("Doble").build());
        roomtypeRepository.save(Roomtype.builder().name("Superior Doble").description("Dos camas, escritorio y bano privado.").price(340.0).capacity("2 adultos").numberOfBeds(2).image("https://giessbach.ch/images/image_uploads/_zimmer/307_DDGB-Zimmer.jpg").type("Doble").build());
        roomtypeRepository.save(Roomtype.builder().name("Familiar Premium").description("Cama king, sofa cama y area de juegos.").price(610.0).capacity("2 adultos + 2 ninos").numberOfBeds(2).image("https://giessbach.ch/images/image_uploads/306_CDGB.jpg").type("Doble").build());
        roomtypeRepository.save(Roomtype.builder().name("Individual Deluxe").description("Cama queen-size y bano en marmol.").price(270.0).capacity("1 adulto").numberOfBeds(1).image("https://www.hola.com/horizon/original_aspect_ratio/f43d5e2f613c-habitaciones-hotel-8a-a.jpg").type("Sencilla").build());
        roomtypeRepository.save(Roomtype.builder().name("Individual Estandar").description("Cama individual y escritorio.").price(150.0).capacity("1 adulto").numberOfBeds(1).image("https://giessbach.ch/images/image_uploads/230_GLWA_neu.jpg").type("Sencilla").build());
        roomtypeRepository.save(Roomtype.builder().name("Penthouse Panoramico").description("Ultimo piso, terraza y piscina privada.").price(2500.0).capacity("2 adultos").numberOfBeds(1).image("https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg").type("Suite").build());
        roomtypeRepository.save(Roomtype.builder().name("Loft Urbano").description("Estilo moderno, cocina equipada.").price(750.0).capacity("2 adultos").numberOfBeds(1).image("https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg").type("Loft").build());

        List<Roomtype> tipos = roomtypeRepository.findAll();

        // ===========================
        // ROOMS
        // ===========================
        for (int piso = 0; piso < 10; piso++) {
            for (int num = 1; num <= 10; num++) {
                String code = (piso + 1) + String.format("%02d", num);
                Room room = new Room(code, true);
                room.setType(tipos.get(random.nextInt(tipos.size())));
                roomRepository.save(room);
            }
        }
        List<Room> rooms = roomRepository.findAll();

        // ===========================
        // SERVICIOS
        // ===========================
        servicioRepository.save(Servicio.builder().nombre("Restaurante Michelin 3 Estrellas").descripcion("Experiencia gastronomica excepcional...").precio(295.0).imagenUrl("https://cldnr.prod.webx.talpa.digital/.../pexels-cottonbro-6466288.jpg").build());
        servicioRepository.save(Servicio.builder().nombre("Spa Royal Bohemia").descripcion("Centro de bienestar de lujo con tratamientos exclusivos...").precio(180.0).imagenUrl("https://images.pexels.com/photos/6560304/pexels-photo-6560304.jpeg").build());
        servicioRepository.save(Servicio.builder().nombre("Bar Kompot Legendario").descripcion("Bar exclusivo famoso por su ambiente nocturno elegante...").precio(35.0).imagenUrl("https://offloadmedia.feverup.com/.../6890019703301565669_n-2-1024x683.jpg").build());

        List<Servicio> servicios = servicioRepository.findAll();

        // ===========================
        // RESERVAS
        // ===========================
        Reserva res1 = reservaRepository.save(Reserva.builder()
                .fechaInicio(LocalDate.of(2025, 10, 1))
                .fechaFin(LocalDate.of(2025, 10, 5))
                .estado("CONFIRMADA")
                .cliente(usuarios.get(0))
                .rooms(List.of(rooms.get(0)))
                .build());

        Reserva res2 = reservaRepository.save(Reserva.builder()
                .fechaInicio(LocalDate.of(2025, 11, 10))
                .fechaFin(LocalDate.of(2025, 11, 15))
                .estado("PENDIENTE")
                .cliente(usuarios.get(1))
                .rooms(List.of(rooms.get(4)))
                .build());

        Reserva res3 = reservaRepository.save(Reserva.builder()
                .fechaInicio(LocalDate.of(2025, 12, 1))
                .fechaFin(LocalDate.of(2025, 12, 8))
                .estado("CANCELADA")
                .cliente(usuarios.get(2))
                .rooms(List.of(rooms.get(9)))
                .build());

        // ===========================
        // CUENTAS
        // ===========================
        cuentaRepository.save(Cuenta.builder()
                .estado("ABIERTA")
                .total(2000.0)
                .reserva(res1)
                .servicios(List.of(servicios.get(0), servicios.get(2)))
                .build());

        cuentaRepository.save(Cuenta.builder()
                .estado("ABIERTA")
                .total(3500.0)
                .reserva(res2)
                .servicios(List.of(servicios.get(1)))
                .build());

        cuentaRepository.save(Cuenta.builder()
                .estado("CERRADA")
                .total(5000.0)
                .reserva(res3)
                .servicios(List.of(servicios.get(0), servicios.get(1)))
                .build());

        // Asignar roles a usuarios existentes que no tienen roles
        assignRolesToUsersWithoutRoles();

        System.out.println("DB inicializada con datos y roles.");
    }

    /**
     * Asigna roles a usuarios existentes que no tienen asignado ningún rol
     * basado en su campo 'tipo'
     */
    private void assignRolesToUsersWithoutRoles() {
        Role rAdmin = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
        Role rOperador = roleRepository.findByName("ROLE_OPERADOR").orElseThrow();
        Role rCliente = roleRepository.findByName("ROLE_CLIENTE").orElseThrow();

        List<Usuario> usuarios = usuarioRepository.findAll();
        int rolesAssigned = 0;

        for (Usuario usuario : usuarios) {
            // Si el usuario no tiene roles asignados
            if (usuario.getRoles() == null || usuario.getRoles().isEmpty()) {
                Role roleToAssign = switch (usuario.getTipo().toLowerCase()) {
                    case "administrador" -> rAdmin;
                    case "operador" -> rOperador;
                    case "cliente" -> rCliente;
                    default -> rCliente;
                };

                usuario.getRoles().add(roleToAssign);
                usuarioRepository.save(usuario);
                rolesAssigned++;
                System.out.println("Rol asignado a usuario: " + usuario.getEmail() + 
                                 " -> " + roleToAssign.getName());
            }
        }

        if (rolesAssigned > 0) {
            System.out.println("Se asignaron " + rolesAssigned + " roles a usuarios sin roles.");
        }
    }
}
