import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServicioService } from '../../services/servicio.service';
import { CuentaService } from '../../services/cuenta.service';
import { Servicio } from '../../model/servicio';
import { Reserva } from '../../model/reserva';

@Component({
  selector: 'app-agregar-servicios',
  templateUrl: './agregar-servicios.component.html',
  styleUrls: ['./agregar-servicios.component.css']
})
export class AgregarServiciosComponent implements OnInit {
  @Input() reserva: Reserva | null = null;
  @Output() serviciosAgregados = new EventEmitter<any>();

  servicios: Servicio[] = [];
  serviciosSeleccionados: Servicio[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private servicioService: ServicioService,
    private cuentaService: CuentaService
  ) { }

  ngOnInit() {
    this.cargarServicios();
  }

  cargarServicios() {
    this.isLoading = true;
    this.errorMessage = '';

    this.servicioService.getAllServicios().subscribe({
      next: (servicios) => {
        this.servicios = servicios;
        console.log('Servicios cargados:', servicios);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.errorMessage = 'Error al cargar los servicios disponibles';
        this.isLoading = false;
      }
    });
  }

  toggleServicio(servicio: Servicio) {
    const index = this.serviciosSeleccionados.findIndex(s => s.idServicio === servicio.idServicio);
    
    if (index > -1) {
      this.serviciosSeleccionados.splice(index, 1);
    } else {
      this.serviciosSeleccionados.push(servicio);
    }
    
    console.log('Servicios seleccionados:', this.serviciosSeleccionados);
  }

  isServicioSeleccionado(servicio: Servicio): boolean {
    return this.serviciosSeleccionados.some(s => s.idServicio === servicio.idServicio);
  }

  calcularTotalServicios(): number {
    return this.serviciosSeleccionados.reduce((total, servicio) => total + servicio.precio, 0);
  }

  agregarServiciosAReserva() {
    if (!this.reserva || this.serviciosSeleccionados.length === 0) {
      this.errorMessage = 'Debe seleccionar al menos un servicio';
      return;
    }

    // Validar si se pueden agregar servicios según el estado de la cuenta
    if (this.reserva.cuenta) {
      const estadoCuenta = this.reserva.cuenta.estado?.toUpperCase();
      
      if (estadoCuenta === 'CERRADA') {
        this.errorMessage = 'No se pueden agregar servicios: la cuenta está cerrada';
        return;
      }
      
      if (estadoCuenta === 'PAGADA') {
        this.errorMessage = 'No se pueden agregar servicios: la cuenta ya está pagada';
        return;
      }
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Agregando servicios a reserva:', this.reserva);
    console.log('Servicios seleccionados:', this.serviciosSeleccionados);

    // Verificar si la reserva tiene cuenta
    if (!this.reserva.cuenta || !this.reserva.cuenta.id) {
      this.crearCuentaConServicios();
    } else {
      this.actualizarCuentaConServicios();
    }
  }

  private crearCuentaConServicios(): void {
    if (!this.reserva) return;

    const totalHabitaciones = this.calcularTotalHabitaciones();
    const totalServicios = this.calcularTotalServicios();

    // Determinar el estado de la cuenta según el estado de la reserva
    let estadoCuenta = 'ABIERTA'; // Por defecto, la cuenta está abierta (se pueden agregar cargos)
    
    // Si la reserva ya finalizó, la cuenta debe estar PENDIENTE de pago
    if (this.reserva.estado === 'FINALIZADA') {
      estadoCuenta = 'PENDIENTE';
    }
    // Si la reserva está cancelada, la cuenta debe estar CERRADA
    else if (this.reserva.estado === 'CANCELADA') {
      estadoCuenta = 'CERRADA';
    }

    const crearCuentaDTO = {
      estado: estadoCuenta, // ABIERTA, CERRADA, PAGADA, PENDIENTE
      total: totalHabitaciones + totalServicios,
      reservaId: this.reserva.id,
      servicioIds: this.serviciosSeleccionados.map(s => s.idServicio)
    };

    console.log('Creando cuenta con servicios:', crearCuentaDTO);
    console.log('Estado de la reserva:', this.reserva.estado);
    console.log('Estado de la cuenta:', estadoCuenta);

    this.cuentaService.addCuenta(crearCuentaDTO as any).subscribe({
      next: (cuentaCreada) => {
        console.log('Cuenta creada exitosamente:', cuentaCreada);
        this.successMessage = 'Servicios agregados exitosamente';
        
        // Emitir evento de éxito
        this.serviciosAgregados.emit({
          cuenta: cuentaCreada,
          servicios: this.serviciosSeleccionados
        });
        
        // Limpiar selección
        this.serviciosSeleccionados = [];
        this.isLoading = false;
        
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error al crear cuenta:', error);
        this.errorMessage = 'Error al agregar servicios: ' + (error.error?.message || error.message);
        this.isLoading = false;
      }
    });
  }

  private actualizarCuentaConServicios(): void {
    if (!this.reserva || !this.reserva.cuenta) return;

    // Verificar nuevamente el estado de la cuenta
    const estadoCuenta = this.reserva.cuenta.estado?.toUpperCase();
    if (estadoCuenta === 'CERRADA' || estadoCuenta === 'PAGADA') {
      this.errorMessage = `No se pueden agregar servicios: la cuenta está ${estadoCuenta.toLowerCase()}`;
      this.isLoading = false;
      return;
    }

    // Obtener IDs de servicios actuales
    const servicioIdsActuales = this.reserva.cuenta.servicios?.map(s => s.idServicio) || [];
    
    // Agregar IDs de servicios nuevos (solo los que no existen)
    const nuevosServicioIds = this.serviciosSeleccionados
      .map(s => s.idServicio)
      .filter(id => !servicioIdsActuales.includes(id));
    
    const todosLosServicioIds = [...servicioIdsActuales, ...nuevosServicioIds];

    // Calcular nuevo total
    const totalHabitaciones = this.calcularTotalHabitaciones();
    const totalServiciosActuales = this.reserva.cuenta.servicios?.reduce((sum, s) => sum + s.precio, 0) || 0;
    const totalServiciosNuevos = this.serviciosSeleccionados
      .filter(s => !servicioIdsActuales.includes(s.idServicio))
      .reduce((sum, s) => sum + s.precio, 0);
    
    const nuevoTotal = totalHabitaciones + totalServiciosActuales + totalServiciosNuevos;

    const actualizarCuentaDTO = {
      estado: this.reserva.cuenta.estado || 'ABIERTA', // Mantener el estado actual de la cuenta
      total: nuevoTotal,
      servicioIds: todosLosServicioIds
    };

    console.log('Actualizando cuenta con servicios:', actualizarCuentaDTO);

    this.cuentaService.updateCuenta({
      id: this.reserva.cuenta.id,
      ...actualizarCuentaDTO
    } as any).subscribe({
      next: (cuentaActualizada) => {
        console.log('Cuenta actualizada exitosamente:', cuentaActualizada);
        this.successMessage = 'Servicios agregados exitosamente';
        
        // Emitir evento de éxito
        this.serviciosAgregados.emit({
          cuenta: cuentaActualizada,
          servicios: this.serviciosSeleccionados
        });
        
        // Limpiar selección
        this.serviciosSeleccionados = [];
        this.isLoading = false;
        
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error al actualizar cuenta:', error);
        this.errorMessage = 'Error al agregar servicios: ' + (error.error?.message || error.message);
        this.isLoading = false;
      }
    });
  }

  private calcularTotalHabitaciones(): number {
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

  limpiarSeleccion() {
    this.serviciosSeleccionados = [];
    this.errorMessage = '';
    this.successMessage = '';
  }

  onImageError(event: any) {
    event.target.src = 'assets/img/image1817.png';
  }

  /**
   * Obtiene el estado legible de la cuenta
   */
  getEstadoCuentaLabel(): string {
    if (!this.reserva?.cuenta) return 'Sin cuenta';
    
    const estado = this.reserva.cuenta.estado;
    switch (estado?.toUpperCase()) {
      case 'ABIERTA':
        return 'Abierta (puede agregar cargos)';
      case 'CERRADA':
        return 'Cerrada (no se pueden agregar cargos)';
      case 'PAGADA':
        return 'Pagada';
      case 'PENDIENTE':
        return 'Pendiente de pago';
      default:
        return estado || 'Sin estado';
    }
  }

  /**
   * Verifica si se pueden agregar servicios a la cuenta
   */
  puedeAgregarServicios(): boolean {
    if (!this.reserva?.cuenta) return true; // Si no hay cuenta, se puede crear una
    
    const estado = this.reserva.cuenta.estado?.toUpperCase();
    return (estado === 'ABIERTA' || estado === 'PENDIENTE') && (this.reserva.estado === 'ACTIVA'  || this.reserva.estado === 'CONFIRMADA' || this.reserva.estado === 'PROXIMA');
  }
}