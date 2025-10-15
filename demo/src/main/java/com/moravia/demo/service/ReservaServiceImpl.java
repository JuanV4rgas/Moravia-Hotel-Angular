package com.moravia.demo.service;

import com.moravia.demo.model.*;
import com.moravia.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ReservaServiceImpl implements ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private CuentaRepository cuentaRepository;

    @Override
    public Reserva searchById(Integer id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
    }

    @Override
    public List<Reserva> searchAll() {
        return reservaRepository.findAll();
    }

@Override
public void add(Reserva reserva) {
    // 1️⃣ Validar cliente
    Usuario cliente = usuarioRepository.findById(reserva.getCliente().getIdUsuario())
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

    if (!"cliente".equalsIgnoreCase(cliente.getTipo())) {
        throw new RuntimeException("Solo los usuarios de tipo 'cliente' pueden realizar reservas");
    }

    // 2️⃣ Validar habitaciones
    List<Room> habitacionesSeleccionadas = reserva.getRooms();
    if (habitacionesSeleccionadas == null || habitacionesSeleccionadas.isEmpty()) {
        throw new RuntimeException("Debe seleccionar al menos una habitación");
    }

    // 3️⃣ Validar fechas
    long noches = ChronoUnit.DAYS.between(reserva.getFechaInicio(), reserva.getFechaFin());
    if (noches <= 0) {
        throw new RuntimeException("Las fechas de la reserva no son válidas");
    }

    // 4️⃣ Calcular total y marcar habitaciones ocupadas
    double total = 0.0;
    for (Room room : habitacionesSeleccionadas) {
        Room habitacion = roomRepository.findById(room.getId())
                .orElseThrow(() -> new RuntimeException("Habitación no encontrada con ID: " + room.getId()));

        if (Boolean.FALSE.equals(habitacion.getAvailable())) {
            throw new RuntimeException("La habitación " + habitacion.getHabitacionNumber() + " no está disponible");
        }

        double subtotal = habitacion.getType().getPrice() * noches;
        total += subtotal;

        habitacion.setAvailable(false);
        roomRepository.save(habitacion);
    }

    // 5️⃣ Guardar reserva primero (sin cuenta aún)
    reserva.setCliente(cliente);
    reserva.setEstado("CONFIRMADA");
    reserva.setCuenta(null);  // se asociará luego
    Reserva reservaGuardada = reservaRepository.save(reserva);

    // 6️⃣ Crear cuenta vinculada a la reserva ya persistida
    Cuenta cuenta = new Cuenta();
    cuenta.setTotal(total);
    cuenta.setReserva(reservaGuardada);
    cuentaRepository.save(cuenta);

    // 7️⃣ Asociar la cuenta y actualizar la reserva
    reservaGuardada.setCuenta(cuenta);
    reservaRepository.save(reservaGuardada);
}


    @Override
public List<Room> buscarHabitacionesDisponibles(LocalDate fechaInicio, LocalDate fechaFin) {
    List<Room> todasLasHabitaciones = roomRepository.findAll();

    // Traemos todas las reservas activas
    List<Reserva> reservas = reservaRepository.findAll();

    return todasLasHabitaciones.stream()
            .filter(room -> {
                // Si la habitación no tiene reservas o está disponible, la mostramos
                if (Boolean.TRUE.equals(room.getAvailable())) {
                    return true;
                }

                // Verificamos si la habitación está libre en las fechas dadas
                boolean ocupada = reservas.stream().anyMatch(reserva ->
                        reserva.getRooms().contains(room) &&
                        (
                            // Se cruzan las fechas
                            ( !reserva.getFechaFin().isBefore(fechaInicio) &&
                              !reserva.getFechaInicio().isAfter(fechaFin) )
                        )
                );

                // Si no está ocupada en el rango, se considera disponible
                return !ocupada;
            })
            .toList();
}

    @Override
    public void update(Reserva reserva) {
        Reserva existing = reservaRepository.findById(reserva.getId())
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        existing.setFechaInicio(reserva.getFechaInicio());
        existing.setFechaFin(reserva.getFechaFin());
        existing.setEstado(reserva.getEstado());
        existing.setRooms(reserva.getRooms());
        existing.setCliente(reserva.getCliente());

        reservaRepository.save(existing);
    }

    @Override
    public void deleteById(Integer id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        // Liberar habitaciones
        if (reserva.getRooms() != null) {
            for (Room r : reserva.getRooms()) {
                r.setAvailable(true);
                roomRepository.save(r);
            }
        }

        reservaRepository.deleteById(id);
    }
}
