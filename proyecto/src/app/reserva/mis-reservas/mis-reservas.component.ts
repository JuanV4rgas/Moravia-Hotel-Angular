import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../services/reserva.service';
import { AuthService } from '../../services/auth.service';
import { Reserva } from '../../model/reserva';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.css']
})
export class MisReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private reservaService: ReservaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarMisReservas();
  }

  cargarMisReservas() {
    this.isLoading = true;
    this.errorMessage = '';

    // Obtener todas las reservas y filtrar por el usuario actual
    this.reservaService.getAllReservas().subscribe({
      next: (reservas) => {
        const usuarioActual = this.authService.usuarioActual;
        if (usuarioActual) {
          // Filtrar reservas del usuario
          this.reservas = reservas.filter(reserva =>
            reserva.cliente.idUsuario === usuarioActual.idUsuario
          );
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        this.errorMessage = 'Error al cargar tus reservas';
        this.isLoading = false;
      }
    });
  }

  verDetalleReserva(reservaId: number) {
    this.router.navigate(['/reserva/detalle', reservaId]);
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
      case 'activa':
        return 'Activa';
      default:
        return estado;
    }
  }

  obtenerInfoEstado(reserva: Reserva) {
    const estado = reserva.estado;
    const hoy = new Date();
    const fechaInicio = new Date(reserva.fechaInicio);
    const fechaFin = new Date(reserva.fechaFin);

    let diasRestantes = 0;
    let mensaje = '';

    switch (estado) {
      case 'PROXIMA':
        diasRestantes = Math.ceil((fechaInicio.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
        mensaje = `Tu reserva comienza en ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}`;
        break;
      case 'ACTIVA':
        diasRestantes = Math.ceil((fechaFin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
        mensaje = `Tu estadía termina en ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}`;
        break;
      case 'CONFIRMADA':
        diasRestantes = Math.ceil((fechaInicio.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
        mensaje = `Tu reserva comienza en ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}`;
        break;
      case 'FINALIZADA':
        mensaje = 'Tu estadía ha terminado';
        break;
      default:
        mensaje = 'Estado de reserva';
    }

    return { estado, diasRestantes, mensaje };
  }
}
