package com.moravia.demo.model;

import org.springframework.boot.ApplicationRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moravia.demo.repository.*;

import java.io.InputStream;
import java.util.List;

// @Component - Deshabilitado para evitar duplicados con DatabaseInitTest
// @Transactional
public class DatabaseInit implements ApplicationRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomtypeRepository roomtypeRepository;

    @Autowired
    private ServicioRepository servicioRepository;


    @Override
    public void run(ApplicationArguments args) throws Exception {
        ObjectMapper mapper = new ObjectMapper();

        // ========================
        // Load Usuarios
        // ========================
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("usuarios.json");
        JsonNode jsonNode = mapper.readTree(inputStream);

        for (JsonNode usuarioJson : jsonNode.get("usuarios")) {
            String email = usuarioJson.get("correo").asText();
            // Verificar si el usuario ya existe para evitar duplicados
            if (usuarioRepository.findByEmail(email) == null) {
                Usuario usuario = new Usuario();
                usuario.setEmail(email);
                usuario.setClave(usuarioJson.get("clave").asText());
                usuario.setNombre(usuarioJson.get("nombre").asText());
                usuario.setApellido(usuarioJson.get("apellido").asText());
                usuario.setCedula(usuarioJson.get("cedula").asText());
                usuario.setTelefono(usuarioJson.get("telefono").asText());
                usuario.setFotoPerfil(usuarioJson.get("fotoPerfil").asText());
                usuario.setTipo(usuarioJson.get("tipo").asText());
                usuarioRepository.save(usuario);
            }
        }
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

            int floor = Integer.parseInt(roomJson.get("numeroHabitacion").asText().substring(0, 1));
            Roomtype rt = roomTypes.get(floor);
            room.setType(rt);

            roomRepository.save(room);
        }

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

    }
}
