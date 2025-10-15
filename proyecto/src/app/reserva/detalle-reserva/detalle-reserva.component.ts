import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { ReservaEstadoService } from '../../services/reserva-estado.service';
import { Reserva } from '../../model/reserva';

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.component.html',
  styleUrls: ['./detalle-reserva.component.css']
})
export class DetalleReservaComponent implements OnInit {
  reserva: Reserva | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  reservaId: number | null = null;
  mostrarAgregarServicios: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservaService: ReservaService,
    private reservaEstadoService: ReservaEstadoService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.reservaId = +params['id'];
      if (this.reservaId) {
        this.cargarDetalleReserva();
      }
    });
  }

  cargarDetalleReserva() {
    if (!this.reservaId) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.reservaService.getReservaById(this.reservaId).subscribe({
      next: (reserva) => {
        // Actualizar el estado de la reserva basado en fechas
        this.reserva = this.reservaEstadoService.actualizarEstadoSiEsNecesario(reserva);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar detalle de reserva:', error);
        this.errorMessage = 'Error al cargar los detalles de la reserva';
        this.isLoading = false;
      }
    });
  }

  pagarReserva() {
    if (!this.reserva) return;

    this.isLoading = true;
    
    // Actualizar el estado de la reserva a finalizada
    const reservaActualizada = { ...this.reserva, estado: 'FINALIZADA' };
    
    this.reservaService.updateReserva(reservaActualizada).subscribe({
      next: () => {
        // Recargar la página para mostrar el cambio
        window.location.reload();
      },
      error: (error) => {
        console.error('Error al pagar reserva:', error);
        this.errorMessage = 'Error al procesar el pago';
        this.isLoading = false;
      }
    });
  }

  volverAMisReservas() {
    this.router.navigate(['/mis-reservas']);
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'confirmada':
        return 'estado-confirmada';
      case 'pendiente':
        return 'estado-pendiente';
      case 'cancelada':
        return 'estado-cancelada';
      case 'finalizada':
        return 'estado-finalizada';
      case 'proxima':
        return 'estado-proxima';
      default:
        return 'estado-default';
    }
  }

  getEstadoTexto(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'confirmada':
        return 'Confirmada';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelada':
        return 'Cancelada';
      case 'finalizada':
        return 'Finalizada';
      case 'proxima':
        return 'Próxima';
      default:
        return estado;
    }
  }

  puedePagar(): boolean {
    return this.reserva?.estado === 'CONFIRMADA';
  }

  puedeCancelar(): boolean {
    return this.reserva?.estado === 'PROXIMA' || this.reserva?.estado === 'CONFIRMADA';
  }

  esReservaActiva(): boolean {
    return this.reserva?.estado === 'ACTIVA';
  }

  puedeFinalizar(): boolean {
    console.log('Estado de la reserva:', this.reserva?.estado);
    console.log('¿Puede finalizar?', this.reserva?.estado === 'ACTIVA');
    return this.reserva?.estado === 'ACTIVA';
  }

  cancelarReserva() {
    if (!this.reserva) return;

    if (confirm('¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer.')) {
      this.isLoading = true;
      
      // Actualizar el estado de la reserva a cancelada
      const reservaActualizada = { ...this.reserva, estado: 'CANCELADA' };
      
      this.reservaService.updateReserva(reservaActualizada).subscribe({
        next: () => {
          // Recargar la página para mostrar el cambio
          window.location.reload();
        },
        error: (error) => {
          console.error('Error al cancelar reserva:', error);
          this.errorMessage = 'Error al cancelar la reserva';
          this.isLoading = false;
        }
      });
    }
  }

  finalizarReserva() {
    console.log('finalizarReserva() llamado');
    if (!this.reserva) {
      console.log('No hay reserva');
      return;
    }

    if (confirm('¿Estás seguro de que quieres finalizar esta reserva? Las habitaciones quedarán disponibles para nuevas reservas.')) {
      console.log('Usuario confirmó finalizar reserva');
      this.isLoading = true;
      
      // Actualizar el estado de la reserva a finalizada
      const reservaActualizada = { 
        ...this.reserva, 
        estado: 'FINALIZADA'
      };
      
      this.reservaService.updateReserva(reservaActualizada).subscribe({
        next: () => {
          // Recargar la página para mostrar el cambio
          window.location.reload();
        },
        error: (error) => {
          console.error('Error al finalizar reserva:', error);
          this.errorMessage = 'Error al finalizar la reserva';
          this.isLoading = false;
        }
      });
    }
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
    if (!this.reserva?.cuenta?.servicios) return 0;
    
    return this.reserva.cuenta.servicios.reduce((total: number, servicio: any) => total + servicio.precio, 0);
  }

  obtenerInfoEstado() {
    if (!this.reserva) return { estado: '', diasRestantes: 0, mensaje: '' };
    return this.reservaEstadoService.obtenerInfoEstado(this.reserva);
  }

  getRoomImage(room: any): string {
    // Si el tipo tiene una imagen específica del backend, usarla directamente
    if (room.type.image && room.type.image !== '' && room.type.image.startsWith('http')) {
      return room.type.image;
    }
    
    // Si no, usar una imagen por defecto basada en el tipo
    const imageMap: { [key: string]: string } = {
      'Suite': 'image1817.png',
      'Doble': 'image1822.png',
      'Sencilla': 'image1854.png',
      'Loft': 'image1911.png'
    };
    
    const defaultImage = imageMap[room.type.type] || 'image1817.png';
    return `assets/img/${defaultImage}`;
  }

  onImageError(event: any) {
    // Si la imagen falla, usar una imagen por defecto
    event.target.src = 'assets/img/image1817.png';
  }

  onServiciosAgregados() {
    // Recargar los detalles de la reserva para mostrar los servicios agregados
    this.cargarDetalleReserva();
    this.mostrarAgregarServicios = false;
  }
}
