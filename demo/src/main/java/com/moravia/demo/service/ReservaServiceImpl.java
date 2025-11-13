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

            roomRepository.save(habitacion);
        }

        // 5️⃣ Guardar reserva primero (sin cuenta aún)
        reserva.setCliente(cliente);
        
        // Si no tiene estado o es PENDIENTE, establecer CONFIRMADA
        if (reserva.getEstado() == null || "PENDIENTE".equals(reserva.getEstado())) {
            reserva.setEstado("CONFIRMADA");
        }
        
        reserva.setCuenta(null);  // se asociará luego
        Reserva reservaGuardada = reservaRepository.save(reserva);

        // 6️⃣ Crear cuenta vinculada a la reserva ya persistida
        Cuenta cuenta = new Cuenta();
        cuenta.setTotal(total);
        cuenta.setSaldo(total); // Initialize saldo to total
        cuenta.setReserva(reservaGuardada);
        
        // ✅ ESTABLECER ESTADO DE LA CUENTA SEGÚN EL ESTADO DE LA RESERVA
        String estadoCuenta = determinarEstadoCuenta(reservaGuardada.getEstado());
        cuenta.setEstado(estadoCuenta);
        
        cuentaRepository.save(cuenta);

        // 7️⃣ Asociar la cuenta y actualizar la reserva
        reservaGuardada.setCuenta(cuenta);
        reservaRepository.save(reservaGuardada);
    }

    /**
     * Determina el estado inicial de la cuenta según el estado de la reserva
     * 
     * Estados de cuenta:
     * - ABIERTA: Se pueden agregar cargos
     * - CERRADA: No se pueden agregar cargos
     * - PAGADA: Cuenta completamente pagada
     * - PENDIENTE: Tiene saldo pendiente de pago
     */
    private String determinarEstadoCuenta(String estadoReserva) {
        if (estadoReserva == null) {
            return "ABIERTA"; // Default
        }
        
        switch (estadoReserva.toUpperCase()) {
            case "CONFIRMADA":
            case "ACTIVA":
            case "PROXIMA":
                return "ABIERTA"; // Se pueden agregar servicios
                
            case "FINALIZADA":
                return "PENDIENTE"; // Esperando pago
                
            case "CANCELADA":
                return "CERRADA"; // No se puede modificar
                
            default:
                return "ABIERTA";
        }
    }

    @Override
    public List<Room> buscarHabitacionesDisponibles(LocalDate fechaInicio, LocalDate fechaFin) {
        List<Room> todasLasHabitaciones = roomRepository.findAll();

        // Traemos todas las reservas activas
        List<Reserva> reservas = reservaRepository.findAll();

        return todasLasHabitaciones.stream()
                .filter(room -> {
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
        System.out.println("🔄 Actualizando reserva ID: " + reserva.getId());
        System.out.println("🔄 Estado a actualizar: " + reserva.getEstado());
        
        Reserva existing = reservaRepository.findById(reserva.getId())
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        System.out.println("🔄 Estado anterior: " + existing.getEstado());
        
        existing.setFechaInicio(reserva.getFechaInicio());
        existing.setFechaFin(reserva.getFechaFin());
        existing.setEstado(reserva.getEstado());
        existing.setRooms(reserva.getRooms());
        existing.setCliente(reserva.getCliente());

        System.out.println("🔄 Estado después de actualizar: " + existing.getEstado());

        // ✅ ACTUALIZAR ESTADO DE LA CUENTA SI CAMBIA EL ESTADO DE LA RESERVA
        if (existing.getCuenta() != null) {
            String nuevoEstadoCuenta = determinarEstadoCuenta(reserva.getEstado());
            Cuenta cuenta = existing.getCuenta();
            
            System.out.println("🔄 Estado de cuenta anterior: " + cuenta.getEstado());
            System.out.println("🔄 Nuevo estado de cuenta: " + nuevoEstadoCuenta);
            
            // Solo actualizar si la cuenta no está PAGADA (es irreversible)
            if (!"PAGADA".equals(cuenta.getEstado())) {
                cuenta.setEstado(nuevoEstadoCuenta);
                cuentaRepository.save(cuenta);
                System.out.println("🔄 Estado de cuenta actualizado: " + cuenta.getEstado());
            }
        }

        reservaRepository.save(existing);
        System.out.println("✅ Reserva actualizada exitosamente");
    }

    @Override
    public void deleteById(Integer id) {
        try {
            // Buscar la reserva con todas sus relaciones cargadas
            Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

            // Liberar las habitaciones antes de eliminar
            if (reserva.getRooms() != null) {
                for (Room room : reserva.getRooms()) {
                    room.setAvailable(true);
                    roomRepository.save(room);
                }
            }

            // Eliminar la reserva - las cascadas manejarán el resto
            reservaRepository.delete(reserva);
            
        } catch (Exception e) {
            throw new RuntimeException("Error al eliminar la reserva: " + e.getMessage());
        }
    }

    @Override
    public List<Reserva> buscarReservasActivas() {
        return reservaRepository.findReservaActiva();
    }
}