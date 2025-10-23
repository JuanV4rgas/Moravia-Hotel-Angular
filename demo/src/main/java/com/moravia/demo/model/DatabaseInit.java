package com.moravia.demo.model;

import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import java.time.LocalDate;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moravia.demo.controller.RoomController;
import com.moravia.demo.repository.*;

import jakarta.transaction.Transactional;

import java.io.InputStream;
import java.util.List;
import java.util.Random;
import java.util.ArrayList;

@Component
@Transactional
public class DatabaseInit implements ApplicationRunner {

    private final RoomController roomController;

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

    public DatabaseInit(RoomController roomController) {
        this.roomController = roomController;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        Random rand = new Random();

        // ========================
        // Load Usuarios
        // ========================
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("usuarios.json");
        JsonNode jsonNode = mapper.readTree(inputStream);

        for (JsonNode usuarioJson : jsonNode.get("usuarios")) {
            Usuario usuario = new Usuario();
            usuario.setEmail(usuarioJson.get("correo").asText());
            usuario.setClave(usuarioJson.get("clave").asText());
            usuario.setNombre(usuarioJson.get("nombre").asText());
            usuario.setApellido(usuarioJson.get("apellido").asText());
            usuario.setCedula(usuarioJson.get("cedula").asText());
            usuario.setTelefono(usuarioJson.get("telefono").asText());
            usuario.setFotoPerfil(usuarioJson.get("fotoPerfil").asText());
            usuario.setTipo(usuarioJson.get("tipo").asText());
            usuarioRepository.save(usuario);
        }

        List<Usuario> usuarios = usuarioRepository.findAll();
        // Filtrar solo los clientes (usuarios con tipo = "cliente")
        List<Usuario> clientes = usuarios.stream()
                .filter(u -> "cliente".equalsIgnoreCase(u.getTipo()))
                .toList();

        // ========================
        // Load RoomTypes
        // ========================
        inputStream = getClass().getClassLoader().getResourceAsStream("roomtypes.json");
        jsonNode = mapper.readTree(inputStream);

        for (JsonNode rtJson : jsonNode.get("roomtypes")) {
            Roomtype rt = new Roomtype();
            rt.setName(rtJson.get("name").asText());
            rt.setDescription(rtJson.get("description").asText());
            rt.setPrice(rtJson.get("price").asDouble());
            rt.setCapacity(rtJson.get("capacity").asText());
            rt.setNumberOfBeds(rtJson.get("numberOfBeds").asInt());
            rt.setImage(rtJson.get("image").asText());
            rt.setType(rtJson.get("type").asText());
            roomtypeRepository.save(rt);
        }

        List<Roomtype> roomTypes = roomtypeRepository.findAll();

        // ========================
        // Load Rooms
        // ========================
        inputStream = getClass().getClassLoader().getResourceAsStream("rooms.json");
        jsonNode = mapper.readTree(inputStream);

        for (JsonNode roomJson : jsonNode.get("rooms")) {
            Room room = new Room();
            room.setHabitacionNumber(roomJson.get("numeroHabitacion").asText());
            room.setAvailable(roomJson.get("disponible").asBoolean());

            Roomtype rt = roomTypes.get(rand.nextInt(roomTypes.size()));
            room.setType(rt);

            roomRepository.save(room);
        }

        List<Room> rooms = roomRepository.findAll();

        // ========================
        // Load Servicios
        // ========================
        inputStream = getClass().getClassLoader().getResourceAsStream("servicios.json");
        jsonNode = mapper.readTree(inputStream);

        for (JsonNode servicioJson : jsonNode.get("servicios")) {
            Servicio servicio = new Servicio();
            servicio.setNombre(servicioJson.get("nombre").asText());
            servicio.setDescripcion(servicioJson.get("descripcion").asText());
            servicio.setPrecio(servicioJson.get("precio").asDouble());
            servicio.setImagenUrl(servicioJson.get("imagenUrl").asText());
            servicioRepository.save(servicio);
        }

        List<Servicio> servicios = servicioRepository.findAll();

        // ========================
        // Crear Reservas y Cuentas Dummy
        // ========================
        for (int i = 0; i < 5; i++) {
            Usuario cliente = clientes.get(rand.nextInt(clientes.size()));

            Reserva reserva = new Reserva();
            reserva.setCliente(cliente);
            reserva.setFechaInicio(LocalDate.parse("2025-10-15"));
            reserva.setFechaFin(LocalDate.parse("2025-10-18"));
            reserva.setEstado("CONFIRMADA");

            List<Room> reservaRooms = new ArrayList<>();
            reservaRooms.add(rooms.get(rand.nextInt(rooms.size())));
            reserva.setRooms(reservaRooms);

            Cuenta cuenta = new Cuenta();
            cuenta.setEstado("ABIERTA");
            cuenta.setTotal(0.0);

            List<Servicio> cuentaServicios = new ArrayList<>();
            cuentaServicios.add(servicios.get(rand.nextInt(servicios.size())));
            cuenta.setServicios(cuentaServicios);

            cuenta.setReserva(reserva);
            reserva.setCuenta(cuenta);

            reservaRepository.save(reserva);
            cuentaRepository.save(cuenta);
        }
    }
}
