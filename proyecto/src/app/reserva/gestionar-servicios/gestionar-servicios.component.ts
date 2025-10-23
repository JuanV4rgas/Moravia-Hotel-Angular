import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { ServicioService } from '../../services/servicio.service';
import { CuentaService } from '../../services/cuenta.service';
import { Reserva } from '../../model/reserva';
import { Servicio } from '../../model/servicio';

@Component({
  selector: 'app-gestionar-servicios',
  templateUrl: './gestionar-servicios.component.html',
  styleUrls: ['./gestionar-servicios.component.css']
})
export class GestionarServiciosComponent implements OnInit {
  reserva: Reserva | null = null;
  servicios: Servicio[] = [];
  serviciosEnCuenta: Servicio[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservaService: ReservaService,
    private servicioService: ServicioService,
    private cuentaService: CuentaService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarReserva(parseInt(id));
      this.cargarServicios();
    }
  }

  cargarReserva(id: number): void {
    this.isLoading = true;
    this.reservaService.getReservaById(id).subscribe({
      next: (reserva) => {
        console.log('Reserva cargada:', reserva);
        this.reserva = reserva;
        
        // Extraer servicios de la cuenta
        if (reserva.cuenta && reserva.cuenta.servicios) {
          this.serviciosEnCuenta = [...reserva.cuenta.servicios];
          console.log('Servicios en cuenta:', this.serviciosEnCuenta);
        } else {
          this.serviciosEnCuenta = [];
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar reserva:', error);
        this.errorMessage = 'Error al cargar la reserva';
        this.isLoading = false;
      }
    });
  }

  cargarServicios(): void {
    this.servicioService.getAllServicios().subscribe({
      next: (servicios) => {
        this.servicios = servicios;
        console.log('Servicios disponibles:', servicios);
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.errorMessage = 'Error al cargar los servicios';
      }
    });
  }

  agregarServicioACuenta(servicio: Servicio): void {
    if (!this.reserva) {
      this.errorMessage = 'No hay reserva seleccionada';
      return;
    }

    // Verificar si el servicio ya está en la cuenta
    const yaExiste = this.serviciosEnCuenta.some(s => s.idServicio === servicio.idServicio);
    if (yaExiste) {
      this.errorMessage = 'Este servicio ya está en la cuenta del cliente';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Verificar si la reserva tiene cuenta
    if (!this.reserva.cuenta || !this.reserva.cuenta.id) {
      // Si no hay cuenta, crearla primero
      this.crearCuentaConServicio(servicio);
    } else {
      // Si ya existe cuenta, actualizar
      this.actualizarCuentaConServicio(servicio);
    }
  }

  private crearCuentaConServicio(servicio: Servicio): void {
    if (!this.reserva) return;

    const totalHabitaciones = this.calcularTotalHabitaciones();
    const totalServicios = servicio.precio;

    // Determinar el estado de la cuenta según el estado de la reserva
    let estadoCuenta = 'ABIERTA';
    if (this.reserva.estado === 'FINALIZADA') {
      estadoCuenta = 'PENDIENTE'; // Si la reserva terminó, la cuenta queda pendiente de pago
    }

    const crearCuentaDTO = {
      estado: estadoCuenta, // ABIERTA, CERRADA, PAGADA, PENDIENTE
      total: totalHabitaciones + totalServicios,
      reservaId: this.reserva.id,
      servicioIds: [servicio.idServicio]
    };

    console.log('Creando cuenta:', crearCuentaDTO);

    this.cuentaService.addCuenta(crearCuentaDTO as any).subscribe({
      next: (cuentaCreada) => {
        console.log('Cuenta creada:', cuentaCreada);
        this.successMessage = 'Servicio agregado exitosamente';
        
        // Recargar la reserva completa para obtener la cuenta actualizada
        this.recargarReserva();
      },
      error: (error) => {
        console.error('Error al crear cuenta:', error);
        this.errorMessage = 'Error al crear la cuenta: ' + (error.error?.message || error.message);
        this.isLoading = false;
      }
    });
  }

  private actualizarCuentaConServicio(servicio: Servicio): void {
    if (!this.reserva || !this.reserva.cuenta) return;

    // Crear lista de IDs de servicios actuales + el nuevo
    const servicioIdsActuales = this.serviciosEnCuenta.map(s => s.idServicio);
    const nuevosServicioIds = [...servicioIdsActuales, servicio.idServicio];

    // Calcular nuevo total
    const totalHabitaciones = this.calcularTotalHabitaciones();
    const totalServicios = this.calcularTotalServicios() + servicio.precio;

    const actualizarCuentaDTO = {
      estado: this.reserva.cuenta.estado || 'ABIERTA', // Mantener el estado actual de la cuenta
      total: totalHabitaciones + totalServicios,
      servicioIds: nuevosServicioIds
    };

    console.log('Actualizando cuenta:', actualizarCuentaDTO);

    this.cuentaService.updateCuenta({
      id: this.reserva.cuenta.id,
      ...actualizarCuentaDTO
    } as any).subscribe({
      next: (cuentaActualizada) => {
        console.log('Cuenta actualizada:', cuentaActualizada);
        this.successMessage = 'Servicio agregado exitosamente';
        
        // Recargar la reserva completa
        this.recargarReserva();
      },
      error: (error) => {
        console.error('Error al actualizar cuenta:', error);
        this.errorMessage = 'Error al agregar el servicio: ' + (error.error?.message || error.message);
        this.isLoading = false;
      }
    });
  }

  eliminarServicioDeCuenta(servicio: Servicio): void {
    if (!this.reserva || !this.reserva.cuenta) {
      this.errorMessage = 'No hay cuenta asociada';
      return;
    }

    const ok = confirm(`¿Eliminar el servicio "${servicio.nombre}" de la cuenta?`);
    if (!ok) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Filtrar el servicio a eliminar
    const servicioIdsRestantes = this.serviciosEnCuenta
      .filter(s => s.idServicio !== servicio.idServicio)
      .map(s => s.idServicio);

    // Recalcular total sin este servicio
    const totalHabitaciones = this.calcularTotalHabitaciones();
    const totalServicios = this.calcularTotalServicios() - servicio.precio;

    const actualizarCuentaDTO = {
      estado: this.reserva.cuenta.estado || 'ABIERTA', // Mantener el estado actual
      total: totalHabitaciones + totalServicios,
      servicioIds: servicioIdsRestantes
    };

    console.log('Eliminando servicio, nueva cuenta:', actualizarCuentaDTO);

    this.cuentaService.updateCuenta({
      id: this.reserva.cuenta.id,
      ...actualizarCuentaDTO
    } as any).subscribe({
      next: (cuentaActualizada) => {
        console.log('Cuenta actualizada después de eliminar:', cuentaActualizada);
        this.successMessage = 'Servicio eliminado exitosamente';
        
        // Recargar la reserva completa
        this.recargarReserva();
      },
      error: (error) => {
        console.error('Error al eliminar servicio:', error);
        this.errorMessage = 'Error al eliminar el servicio: ' + (error.error?.message || error.message);
        this.isLoading = false;
      }
    });
  }

  private recargarReserva(): void {
    if (!this.reserva || !this.reserva.id) return;
    
    const reservaId = this.reserva.id;
    
    this.reservaService.getReservaById(reservaId).subscribe({
      next: (reservaActualizada) => {
        console.log('Reserva recargada:', reservaActualizada);
        this.reserva = reservaActualizada;
        
        // Actualizar servicios en cuenta
        if (reservaActualizada.cuenta && reservaActualizada.cuenta.servicios) {
          this.serviciosEnCuenta = [...reservaActualizada.cuenta.servicios];
        } else {
          this.serviciosEnCuenta = [];
        }
        
        this.isLoading = false;
        
        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error al recargar reserva:', error);
        this.errorMessage = 'Error al recargar la reserva';
        this.isLoading = false;
      }
    });
  }

  calcularTotalHabitaciones(): number {
    if (!this.reserva) return 0;
    
    let total = 0;
    const fechaInicio = new Date(this.reserva.fechaInicio);
    const fechaFin = new Date(this.reserva.fechaFin);
    const noches = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    
    for (const room of this.reserva.rooms) {
      total += room.type.price * noches;
    }
    
    return total;
  }

  calcularTotalServicios(): number {
    return this.serviciosEnCuenta.reduce((total, servicio) => total + servicio.precio, 0);
  }

  calcularTotalCuenta(): number {
    const totalHabitaciones = this.calcularTotalHabitaciones();
    const totalServicios = this.calcularTotalServicios();
    return totalHabitaciones + totalServicios;
  }

  // Método para obtener el estado de pago legible
  getEstadoCuentaLabel(): string {
    if (!this.reserva?.cuenta) return 'Sin cuenta';
    
    const estado = this.reserva.cuenta.estado;
    switch (estado?.toUpperCase()) {
      case 'ABIERTA':
        return 'Cuenta Abierta (puede agregar cargos)';
      case 'CERRADA':
        return 'Cuenta Cerrada';
      case 'PAGADA':
        return 'Cuenta Pagada';
      case 'PENDIENTE':
        return 'Pago Pendiente';
      default:
        return estado || 'Sin estado';
    }
  }

  volverATabla(): void {
    this.router.navigate(['/reserva/table']);
  }

  onImageError(event: any): void {
    event.target.src = 'assets/img/image1817.png';
  }

  // Este es para el estado de la RESERVA, no de la cuenta
  getEstadoClass(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'INACTIVA':
        return 'INACTIVA';
      case 'ACTIVA':
        return 'ACTIVA';
      case 'CONFIRMADA':
        return 'CONFIRMADA';
      case 'FINALIZADA':
        return 'FINALIZADA';
      case 'CANCELADA':
        return 'CANCELADA';
      default:
        return '';
    }
  }
}