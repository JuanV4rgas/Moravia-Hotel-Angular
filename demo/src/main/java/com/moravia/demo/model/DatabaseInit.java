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
        if (roomtypeRepository.count() == 0) {
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
        }

        List<Roomtype> tipos = roomtypeRepository.findAll();

        // ===========================
        // ROOMS
        // ===========================
        if (roomRepository.count() == 0) {
            for (int piso = 0; piso < 10; piso++) {
                for (int num = 1; num <= 10; num++) {
                    String code = (piso + 1) + String.format("%02d", num);
                    Room room = new Room(code, true);
                    room.setType(tipos.get(random.nextInt(tipos.size())));
                    roomRepository.save(room);
                }
            }
        }
        List<Room> rooms = roomRepository.findAll();

        // ===========================
        // SERVICIOS
        // ===========================
        if (servicioRepository.count() == 0) {
        servicioRepository.save(Servicio.builder().nombre("Restaurante Michelin 3 Estrellas")
                .descripcion("Experiencia gastronómica excepcional en uno de los comedores más prestigiosos del mundo, con menú degustación de cocina checa contemporánea y vinos seleccionados.").precio(295.0)
                .imagenUrl("https://cldnr.prod.webx.talpa.digital/talpa-network/image/fetch/f_auto,c_limit,w_3840,q_auto/https://images.ctfassets.net/mwdlh7x5m54h/72sO8UnNUwLASrqMK86d3x/bb012a3c1006d7daa6d6ca8bf0fb2690/pexels-cottonbro-6466288.jpg").build());
        servicioRepository.save(Servicio.builder().nombre("Spa Royal Bohemia")
                .descripcion("Centro de bienestar de lujo con tratamientos exclusivos, sauna finlandesa, baño turco y piscina climatizada con vistas al Castillo de Praga.").precio(180.0)
                .imagenUrl("https://images.pexels.com/photos/6560304/pexels-photo-6560304.jpeg").build());
        servicioRepository.save(Servicio.builder().nombre("Bar Kompot Legendario")
                .descripcion("Bar exclusivo famoso por su ambiente nocturno elegante, cócteles artesanales y el legendario kompot de la casa con vista panorámica de Malá Strana.").precio(35.0)
                .imagenUrl("https://offloadmedia.feverup.com/secretsanfrancisco.com/wp-content/uploads/2023/02/13023230/68693037_151390299393573_6890019703301565669_n-2-1024x683.jpg").build());
        servicioRepository.save(Servicio.builder().nombre("Cafetería Imperial")
                .descripcion("Cafetería de ambiente refinado que sirve café de especialidad, pasteles artesanales y té de las mejores plantaciones del mundo en un entorno histórico.").precio(13.0)
                .imagenUrl("https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg").build());
        servicioRepository.save(Servicio.builder().nombre("Piscina Infinity Castillo")
                .descripcion("Piscina climatizada tipo infinity con vista directa a nuestro castillo, área de relajación y servicio de toallas premium.").precio(45.0)
                .imagenUrl("https://giessbach.ch/images/image_uploads/GrandhotelGiessbach_%C2%A9DigitaleMassarbeit_503.jpg").build());
        servicioRepository.save(Servicio.builder().nombre("Servicio de Conserjería Premium")
                .descripcion("Conserjería 24/7 especializada en experiencias exclusivas: reservas en restaurantes, entradas VIP a eventos, tours privados por Praga y servicios personalizados.").precio(125.0)
                .imagenUrl("https://guianzalibre.com/wp-content/uploads/2023/12/Agente-de-Viajes-1-1024x819.png").build());
        servicioRepository.save(Servicio.builder().nombre("Servicio de Habitaciones 24h")
                .descripcion("Servicio de habitaciones disponible las 24 horas con menú gourmet, champagne y delicatessen locales servidos con elegancia en vajilla de porcelana.").precio(85.0)
                .imagenUrl("https://www.hola.com/horizon/original_aspect_ratio/f43d5e2f613c-habitaciones-hotel-8a-a.jpg").build());
        servicioRepository.save(Servicio.builder().nombre("Servicio de Mayordomo Personal")
                .descripcion("Mayordomo personal dedicado para suites de lujo, disponible para desempaque, planchado, reservas y atención personalizada durante toda la estancia.").precio(120.0)
                .imagenUrl("https://poloandtweed.com/wp-content/uploads/2023/02/Blog-Photos-5.png").build());
        servicioRepository.save(Servicio.builder().nombre("Traslados Privados de Lujo")
                .descripcion("Servicio de traslado en vehículos de lujo (Mercedes-Benz Clase S, BMW Serie 7) desde/hacia aeropuerto y tours privados por la ciudad.").precio(85.0)
                .imagenUrl("https://media.tacdn.com/media/attractions-splice-spp-674x446/09/5b/57/2a.jpg").build());
        servicioRepository.save(Servicio.builder().nombre("Salones para Eventos Privados")
                .descripcion("Espacios elegantes para eventos corporativos y celebraciones privadas con capacidad de 20-150 personas, incluye catering gourmet y coordinación completa.").precio(5000.0)
                .imagenUrl("https://media-cdn.tripadvisor.com/media/photo-s/07/c5/bc/b0/grandhotel-giessbach.jpg").build());
        servicioRepository.save(Servicio.builder().nombre("Lavandería y Tintorería Premium")
                .descripcion("Servicio de lavandería express y tintorería especializada en prendas de diseñador, con entrega en 4-24 horas según urgencia.").precio(50.0)
                .imagenUrl("https://www.love2laundry.com/blog/wp-content/uploads/2023/06/shutterstock_1019517997.jpg").build());
        servicioRepository.save(Servicio.builder().nombre("Gimnasio Fitness Premium")
                .descripcion("Gimnasio equipado con máquinas Technogym de última generación, entrenador personal disponible y clases de yoga y pilates privadas.").precio(40.0)
                .imagenUrl("https://www.grandhotelpalace.gr/sites/default/files/styles/pagefull/public/130640-gym.jpg?itok=kGXeTJxG").build());
        servicioRepository.save(Servicio.builder().nombre("Boutique de Souvenirs de Lujo")
                .descripcion("Boutique exclusiva con artesanías bohemias auténticas, cristal de Bohemia, joyas checas y productos gourmet locales de la más alta calidad.").precio(150.0)
                .imagenUrl("https://images.e-guma.ch/2644/events/f6684d91df1e4f8d90b9eb326908f654.jpeg").build());
        servicioRepository.save(Servicio.builder().nombre("Servicio de Valet Parking")
                .descripcion("Aparcamiento subterráneo vigilado las 24 horas con servicio de valet para vehículos de huéspedes, incluyendo lavado básico gratuito.").precio(45.0)
                .imagenUrl("https://staffhotel.es/assets/2024/02/valet-hotel.jpg").build());
        servicioRepository.save(Servicio.builder().nombre("Cama de Lujo para Mascotas")
                .descripcion("Cama ortopédica premium con ropa de cama hipoalergénica y manta de cachemira para el máximo confort de su mascota durante la estancia.").precio(25.0)
                .imagenUrl("https://media.architecturaldigest.com/photos/56c7a8c1cd3bcb326e99b482/16:9/w_2580,c_limit/pet-friendly-luxury-hotels-01.jpg?mbid=social_retweet").build());
        servicioRepository.save(Servicio.builder().nombre("Menú Gourmet para Mascotas")
                .descripcion("Comida artesanal preparada por chef especializado en nutrición animal, con ingredientes orgánicos locales y opciones dietéticas especiales.").precio(35.0)
                .imagenUrl("https://thesaucemag.com/wp-content/uploads/2024/08/dog-friendly-restaurants-london-megans-scaled.jpg").build());
        servicioRepository.save(Servicio.builder().nombre("Servicio de Paseos Premium")
                .descripcion("Paseos personalizados por los jardines históricos de Malá Strana y parques cercanos, realizados por cuidadores profesionales certificados.").precio(40.0)
                .imagenUrl("https://ichef.bbci.co.uk/ace/standard/2560/cpsprodpb/ddb5/live/6a81be00-0ee6-11f0-9471-fd068d782b6b.jpg").build());
        servicioRepository.save(Servicio.builder().nombre("Pet-Sitting Profesional")
                .descripcion("Cuidador personal dedicado disponible 24/7 para atención, juegos, alimentación y compañía mientras los huéspedes disfrutan de otros servicios del hotel.").precio(60.0)
                .imagenUrl("https://valleypetsitting.com/wp-content/uploads/2022/04/valley-pet-sitting-dogs-cats.jpg").build());
        servicioRepository.save(Servicio.builder().nombre("Spa y Grooming para Mascotas")
                .descripcion("Servicio completo de spa incluyendo baño con productos naturales, corte de uñas, cepillado profesional y aromaterapia relajante.").precio(85.0)
                .imagenUrl("https://hiccpet.com/cdn/shop/articles/benefits-of-grooming-your-pet-featured-image.png?v=1719858000").build());
        servicioRepository.save(Servicio.builder().nombre("Kit de Bienvenida Pet-Friendly")
                .descripcion("Kit de cortesía con juguetes artesanales checos, treats gourmet, correa de diseño y guía personalizada de lugares pet-friendly en Praga.").precio(45.0)
                .imagenUrl("https://americanlifestylemag.com/wp-content/uploads/2020/02/dog-lover-basket-intext.jpg").build());
        servicioRepository.save(Servicio.builder().nombre("Cena Maridaje en Bodega Privada")
                .descripcion("Experiencia exclusiva en bodega privada del hotel con cena de 7 tiempos maridada con vinos checos premium y champagne, para máximo 12 personas.").precio(385.0)
                .imagenUrl("https://media.istockphoto.com/id/991732782/es/foto/primer-plano-de-sumiller-sirviendo-vino-tinto-en-el-restaurante.jpg?s=612x612&w=0&k=20&c=pKjj9hZWme99DxzTBBL5pxPFAQCYvZLVmvtAmHPjh2M=").build());
        servicioRepository.save(Servicio.builder().nombre("Tours en Helicóptero sobre Praga")
                .descripcion("Tour panorámico exclusivo en helicóptero privado sobre el casco histórico de Praga, Castillo y río Moldava, con champagne incluido.").precio(1200.0)
                .imagenUrl("https://media.tacdn.com/media/attractions-splice-spp-674x446/0f/76/db/df.jpg").build());
        servicioRepository.save(Servicio.builder().nombre("Cena Romántica en Barco Privado")
                .descripcion("Cena romántica para dos personas en barco privado navegando el río Moldava, con menú gourmet, champagne y vista nocturna iluminada de Praga.").precio(650.0)
                .imagenUrl("https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/dubriani.com/wp-content/uploads/2022/07/Image-01-png.webp").build());
        }

        List<Servicio> servicios = servicioRepository.findAll();

        // ===========================
        // RESERVAS
        // ===========================
        // Crear reservas iniciales SOLO para usuarios de tipo 'cliente'
        // Las reservas abarcan los últimos 6 meses para mostrar evolución en gráficos
        List<Usuario> clientes = usuarios.stream()
                .filter(u -> u.getTipo() != null && u.getTipo().equalsIgnoreCase("cliente"))
                .toList();

        System.out.println("Total de clientes encontrados: " + clientes.size());

        List<Reserva> reservasCreadas = new java.util.ArrayList<>();

        // Solo crear reservas si hay clientes disponibles y no existen reservas
        if (!clientes.isEmpty() && reservaRepository.count() == 0) {
            int maxReservas = 6;
            int[] roomIndices = { 0, 4, 9 };
            int clienteIdx = 0;

            for (int i = 0; i < maxReservas; i++) {
                Usuario cliente = clientes.get(clienteIdx % clientes.size());
                clienteIdx++;

                int roomIdx = roomIndices[i % roomIndices.length];
                Room selectedRoom = rooms.get(roomIdx % rooms.size());

                // Distribuir reservas en los últimos 6 meses
                LocalDate fechaInicio = LocalDate.now().minusMonths(6 - i);
                LocalDate fechaFin = fechaInicio.plusDays(4);

                Reserva r = reservaRepository.save(Reserva.builder()
                        .fechaInicio(fechaInicio)
                        .fechaFin(fechaFin)
                        .estado("CONFIRMADA")
                        .cliente(cliente)
                        .rooms(List.of(selectedRoom))
                        .build());

                reservasCreadas.add(r);
                System.out.println("✓ Reserva creada: " + cliente.getNombre() + " (" + cliente.getEmail()
                        + ") - Habitación " + selectedRoom.getHabitacionNumber() + " - " + fechaInicio + " a "
                        + fechaFin);
            }
        } else {
            if (clientes.isEmpty()) {
                System.out.println("⚠ No hay clientes disponibles para crear reservas");
            } else if (reservaRepository.count() > 0) {
                System.out.println("Reservas ya existen, saltando creación.");
            }
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

            // Calcular precio de la habitación
            double precioHabitacion = 0.0;
            if (r.getRooms() != null && !r.getRooms().isEmpty()) {
                Room room = r.getRooms().get(0); // Asumiendo una habitación por reserva
                if (room.getType() != null && room.getType().getPrice() != null) {
                    precioHabitacion = room.getType().getPrice();
                }
            }

            double total = precioHabitacion + totalServicios;

            Cuenta cuenta = Cuenta.builder()
                    .estado("PAGADA")
                    .total(total)
                    .saldo(total)
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

                // Inicializar roles si es null
                if (usuario.getRoles() == null) {
                    usuario.setRoles(new java.util.HashSet<>());
                }
                usuario.getRoles().add(roleToAssign);
                usuarioRepository.save(usuario);
                rolesAssigned++;
                System.out.println("✓ Rol asignado a usuario: " + usuario.getEmail() +
                        " -> " + roleToAssign.getName());
            }
        }

        if (rolesAssigned > 0) {
            System.out.println("✓ Se asignaron " + rolesAssigned + " roles a usuarios sin roles.");
        } else {
            System.out.println("✓ Todos los usuarios ya tienen roles asignados.");
        }
    }
}
