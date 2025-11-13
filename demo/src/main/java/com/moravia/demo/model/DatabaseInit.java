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

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private RoomtypeRepository roomtypeRepository;
    @Autowired
    private ServicioRepository servicioRepository;
    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private CuentaRepository cuentaRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {

        // Si ya hay usuarios, saltamos la inicialización (evita duplicación en cada
        // restart)
        List<Usuario> usuariosExistentes = usuarioRepository.findAll();
        if (!usuariosExistentes.isEmpty()) {
            System.out.println("BD ya inicializada. Saltando DatabaseInit.");
            return;
        }

        Random random = new Random(42);

        // ===========================
        // ROLES + USUARIOS (BCrypt)
        // ===========================
        Role rAdmin = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_ADMIN").build()));
        Role rOperador = roleRepository.findByName("ROLE_OPERADOR")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_OPERADOR").build()));
        Role rCliente = roleRepository.findByName("ROLE_CLIENTE")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_CLIENTE").build()));

        // Crear usuarios solo si no existen
        saveUserIfNotExists("juan.perez@example.com", passwordEncoder.encode("clave123"), "Juan", "Perez",
                "1234567890", "3001234567", "https://randomuser.me/api/portraits/men/1.jpg", "administrador", rAdmin);
        saveUserIfNotExists("maria.gomez@example.com", passwordEncoder.encode("pass456"), "Maria", "Gomez",
                "9876543210", "3012345678", "https://randomuser.me/api/portraits/women/2.jpg", "cliente", rCliente);
        saveUserIfNotExists("carlos.rojas@example.com", passwordEncoder.encode("carlos123"), "Carlos", "Rojas",
                "1112233445", "3024567890", "https://randomuser.me/api/portraits/men/3.jpg", "operador", rOperador);
        saveUserIfNotExists("laura.martinez@example.com", passwordEncoder.encode("laura456"), "Laura", "Martinez",
                "5544332211", "3041234567", "https://randomuser.me/api/portraits/women/4.jpg", "cliente", rCliente);
        saveUserIfNotExists("andres.mendoza@example.com", passwordEncoder.encode("andres789"), "Andres", "Mendoza",
                "1029384756", "3056789123", "https://randomuser.me/api/portraits/men/5.jpg", "administrador", rAdmin);
        saveUserIfNotExists("paola.rivera@example.com", passwordEncoder.encode("paola789"), "Paola", "Rivera",
                "0192837465", "3065432189", "https://randomuser.me/api/portraits/women/6.jpg", "operador", rOperador);
        saveUserIfNotExists("felipe.sanchez@example.com", passwordEncoder.encode("felipe321"), "Felipe", "Sanchez",
                "1230984567", "3071112233", "https://randomuser.me/api/portraits/men/7.jpg", "cliente", rCliente);
        saveUserIfNotExists("camila.ortiz@example.com", passwordEncoder.encode("camila654"), "Camila", "Ortiz",
                "7654321098", "3089988776", "https://randomuser.me/api/portraits/women/8.jpg", "cliente", rCliente);

        List<Usuario> usuarios = usuarioRepository.findAll();

        // ===========================
        // ROOMTYPES
        // ===========================
        roomtypeRepository.save(Roomtype.builder().name("Suite Presidencial")
                .description("Suite de lujo con jacuzzi y mayordomo.").price(1850.0).capacity("2 adultos + 1 nino")
                .numberOfBeds(1)
                .image("https://giessbach.ch/images/image_uploads/GrandhotelGiessbach_%C2%A9DigitaleMassarbeit_269.jpg")
                .type("Suite").build());
        roomtypeRepository.save(Roomtype.builder().name("Suite Real")
                .description("Decoracion clasica, chimenea y terraza.").price(1350.0).capacity("2 adultos")
                .numberOfBeds(1).image("https://giessbach.ch/images/image_uploads/224_Weber-Suite-Wohnzimmer.jpg")
                .type("Suite").build());
        roomtypeRepository.save(Roomtype.builder().name("Junior Suite")
                .description("Elegante con sala de estar separada.").price(890.0).capacity("2 adultos + 1 nino")
                .numberOfBeds(1).image("https://giessbach.ch/images/image_uploads/Suite-Horace-Edouard-Zimmer.jpg")
                .type("Suite").build());
        roomtypeRepository.save(Roomtype.builder().name("Deluxe Panoramica")
                .description("Vistas al centro historico de Praga.").price(520.0).capacity("2 adultos").numberOfBeds(1)
                .image("https://giessbach.ch/images/image_uploads/_zimmer/Suite-von-Rappard-Wohnecke.jpg").type("Doble")
                .build());
        roomtypeRepository.save(Roomtype.builder().name("Superior Doble")
                .description("Dos camas, escritorio y bano privado.").price(340.0).capacity("2 adultos").numberOfBeds(2)
                .image("https://giessbach.ch/images/image_uploads/_zimmer/307_DDGB-Zimmer.jpg").type("Doble").build());
        roomtypeRepository.save(Roomtype.builder().name("Familiar Premium")
                .description("Cama king, sofa cama y area de juegos.").price(610.0).capacity("2 adultos + 2 ninos")
                .numberOfBeds(2).image("https://giessbach.ch/images/image_uploads/306_CDGB.jpg").type("Doble").build());
        roomtypeRepository.save(Roomtype.builder().name("Individual Deluxe")
                .description("Cama queen-size y bano en marmol.").price(270.0).capacity("1 adulto").numberOfBeds(1)
                .image("https://www.hola.com/horizon/original_aspect_ratio/f43d5e2f613c-habitaciones-hotel-8a-a.jpg")
                .type("Sencilla").build());
        roomtypeRepository.save(Roomtype.builder().name("Individual Estandar")
                .description("Cama individual y escritorio.").price(150.0).capacity("1 adulto").numberOfBeds(1)
                .image("https://giessbach.ch/images/image_uploads/230_GLWA_neu.jpg").type("Sencilla").build());
        roomtypeRepository.save(Roomtype.builder().name("Penthouse Panoramico")
                .description("Ultimo piso, terraza y piscina privada.").price(2500.0).capacity("2 adultos")
                .numberOfBeds(1).image("https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg")
                .type("Suite").build());
        roomtypeRepository.save(Roomtype.builder().name("Loft Urbano").description("Estilo moderno, cocina equipada.")
                .price(750.0).capacity("2 adultos").numberOfBeds(1)
                .image("https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg").type("Loft").build());

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
        servicioRepository.save(Servicio.builder().nombre("Restaurante Michelin 3 Estrellas")
                .descripcion("Experiencia gastronomica excepcional...").precio(295.0)
                .imagenUrl("https://cldnr.prod.webx.talpa.digital/.../pexels-cottonbro-6466288.jpg").build());
        servicioRepository.save(Servicio.builder().nombre("Spa Royal Bohemia")
                .descripcion("Centro de bienestar de lujo con tratamientos exclusivos...").precio(180.0)
                .imagenUrl("https://images.pexels.com/photos/6560304/pexels-photo-6560304.jpeg").build());
        servicioRepository.save(Servicio.builder().nombre("Bar Kompot Legendario")
                .descripcion("Bar exclusivo famoso por su ambiente nocturno elegante...").precio(35.0)
                .imagenUrl("https://offloadmedia.feverup.com/.../6890019703301565669_n-2-1024x683.jpg").build());

        List<Servicio> servicios = servicioRepository.findAll();

        // ===========================
        // RESERVAS
        // ===========================
        // Crear reservas iniciales SOLO para usuarios de tipo 'cliente'
        List<Usuario> clientes = usuarios.stream()
                .filter(u -> u.getTipo() != null && u.getTipo().equalsIgnoreCase("cliente"))
                .toList();

        List<Reserva> reservasCreadas = new java.util.ArrayList<>();
        int maxReservas = 6;
        int[] roomIndices = { 0, 4, 9 };

        for (int i = 0, j = 0; i < maxReservas; i++) {
            if (j == clientes.size() - 1)
                j = 0;
            Usuario cliente = clientes.get(j);
            j++;
            int roomIdx = roomIndices[i % roomIndices.length];
            Room selectedRoom = rooms.get(roomIdx % rooms.size());

            Reserva r = reservaRepository.save(Reserva.builder()
                    .fechaInicio(LocalDate.now())
                    .fechaFin(LocalDate.now().plusDays(4))
                    .estado("CONFIRMADA")
                    .cliente(cliente)
                    .rooms(List.of(selectedRoom))
                    .build());

            reservasCreadas.add(r);
        }

        // Crear cuentas para cada reserva creada: 1 room por reserva y 2 servicios
        // asociados
        for (int i = 0; i < reservasCreadas.size(); i++) {
            Reserva r = reservasCreadas.get(i);
            if (r == null)
                continue;

            // seleccionar dos servicios distintos (circular)
            Servicio s1 = servicios.get(i % servicios.size());
            Servicio s2 = servicios.get((i + 1) % servicios.size());

            double totalServicios = 0.0;
            if (s1.getPrecio() != null)
                totalServicios += s1.getPrecio();
            if (s2.getPrecio() != null)
                totalServicios += s2.getPrecio();

            Cuenta cuenta = Cuenta.builder()
                    .estado("ABIERTA")
                    .total(totalServicios)
                    .reserva(r)
                    .servicios(List.of(s1, s2))
                    .build();

            cuentaRepository.save(cuenta);
        }

        // Asignar roles a usuarios existentes que no tienen roles
        assignRolesToUsersWithoutRoles();

        System.out.println("DB inicializada con datos y roles.");
    }

    /**
     * Guarda un usuario solo si no existe uno con el mismo email
     */
    private void saveUserIfNotExists(String email, String clave, String nombre, String apellido, String cedula,
            String telefono, String fotoPerfil, String tipo, Role role) {
        if (usuarioRepository.findByEmail(email) == null) {
            usuarioRepository.save(Usuario.builder()
                    .email(email)
                    .clave(clave)
                    .nombre(nombre)
                    .apellido(apellido)
                    .cedula(cedula)
                    .telefono(telefono)
                    .fotoPerfil(fotoPerfil)
                    .tipo(tipo)
                    .roles(new java.util.HashSet<>(java.util.List.of(role)))
                    .build());
        }
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
