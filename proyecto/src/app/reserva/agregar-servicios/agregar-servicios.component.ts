import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServicioService } from '../../services/servicio.service';
import { ReservaService } from '../../services/reserva.service';
import { Servicio } from '../../model/servicio';
import { Reserva } from '../../model/reserva';

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
    private reservaService: ReservaService
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

    // Crear una copia de la reserva con los servicios agregados
    const reservaActualizada = { ...this.reserva };
    
    // Agregar servicios a la cuenta si existe, o crear una nueva cuenta
    if (!reservaActualizada.cuenta) {
      reservaActualizada.cuenta = {
        id: 0,
        total: 0,
        servicios: []
      };
    }

    // Agregar los servicios seleccionados
    if (!reservaActualizada.cuenta.servicios) {
      reservaActualizada.cuenta.servicios = [];
    }

    // Agregar servicios que no estén ya en la cuenta
    for (const servicio of this.serviciosSeleccionados) {
      const yaExiste = reservaActualizada.cuenta.servicios.some(s => s.idServicio === servicio.idServicio);
      if (!yaExiste) {
        reservaActualizada.cuenta.servicios.push(servicio);
      }
    }

    // Recalcular el total
    const totalHabitaciones = this.calcularTotalHabitaciones();
    const totalServicios = reservaActualizada.cuenta.servicios.reduce((total, servicio) => total + servicio.precio, 0);
    reservaActualizada.cuenta.total = totalHabitaciones + totalServicios;

    // Actualizar la reserva en el backend
    this.reservaService.updateReserva(reservaActualizada).subscribe({
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
