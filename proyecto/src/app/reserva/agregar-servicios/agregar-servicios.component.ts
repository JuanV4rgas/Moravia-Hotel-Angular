import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServicioService } from '../../services/servicio.service';
import { ReservaService } from '../../services/reserva.service';
import { CuentaService } from '../../services/cuenta.service';
import { Servicio } from '../../model/servicio';
import { Reserva } from '../../model/reserva';
import { Cuenta } from '../../model/cuenta';

@Component({
  selector: 'app-agregar-servicios',
  templateUrl: './agregar-servicios.component.html',
  styleUrls: ['./agregar-servicios.component.css']
})
export class AgregarServiciosComponent implements OnInit {
  @Input() reserva: Reserva | null = null;
  @Output() serviciosAgregados = new EventEmitter<void>();

  servicios: Servicio[] = [];
  serviciosSeleccionados: Servicio[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private servicioService: ServicioService,
    private reservaService: ReservaService,
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
      // Remover servicio
      this.serviciosSeleccionados.splice(index, 1);
    } else {
      // Agregar servicio
      this.serviciosSeleccionados.push(servicio);
    }
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

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Verificar si la reserva tiene cuenta, si no, crear una
    let cuentaActual: any = this.reserva.cuenta;
    
    if (!cuentaActual) {
      // Crear nueva cuenta si no existe
      cuentaActual = {
        total: this.calcularTotalHabitaciones(),
        servicios: []
      };
    } else {
      // Obtener la cuenta actual
      cuentaActual = { ...this.reserva.cuenta };
    }

    // Agregar servicios que no estén ya en la cuenta
    for (const servicio of this.serviciosSeleccionados) {
      const yaExiste = cuentaActual?.servicios?.some((s: any) => s.idServicio === servicio.idServicio);
      if (!yaExiste) {
        if (!cuentaActual?.servicios) {
          cuentaActual.servicios = [];
        }
        cuentaActual.servicios.push(servicio);
      }
    }

    // Recalcular el total
    const totalHabitaciones = this.calcularTotalHabitaciones();
    const totalServicios = cuentaActual?.servicios?.reduce((total: number, servicio: any) => total + servicio.precio, 0) || 0;
    cuentaActual.total = totalHabitaciones + totalServicios;

    // Actualizar o crear la cuenta en el backend
    if (cuentaActual && cuentaActual.id) {
      // Si la cuenta ya existe, actualizarla
      this.cuentaService.updateCuenta(cuentaActual).subscribe({
        next: () => {
          this.successMessage = 'Servicios agregados exitosamente';
          this.serviciosSeleccionados = [];
          this.serviciosAgregados.emit();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al agregar servicios:', error);
          this.errorMessage = 'Error al agregar los servicios a la reserva';
          this.isLoading = false;
        }
      });
    } else if (cuentaActual) {
      // Si la cuenta no existe, crearla
      this.cuentaService.addCuenta(cuentaActual).subscribe({
        next: () => {
          this.successMessage = 'Servicios agregados exitosamente';
          this.serviciosSeleccionados = [];
          this.serviciosAgregados.emit();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al crear cuenta:', error);
          this.errorMessage = 'Error al crear la cuenta para la reserva';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'No se pudo crear la cuenta para la reserva';
      this.isLoading = false;
    }
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
    // Si la imagen falla, usar una imagen por defecto
    event.target.src = 'assets/img/image1817.png';
  }
}
