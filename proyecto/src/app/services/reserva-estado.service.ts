import { Injectable } from '@angular/core';
import { Reserva } from '../model/reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservaEstadoService {

  constructor() { }

  /**
   * Determina el estado actual de una reserva basado en las fechas
   */
  determinarEstadoReserva(reserva: Reserva): string {
    const hoy = new Date();
    const fechaInicio = new Date(reserva.fechaInicio);
    const fechaFin = new Date(reserva.fechaFin);
    
    // Si ya pasó la fecha de fin, está finalizada
    if (fechaFin < hoy) {
      return 'FINALIZADA';
    }
    
    // Si estamos entre la fecha de inicio y fin, está activa
    if (fechaInicio <= hoy && hoy <= fechaFin) {
      return 'ACTIVA';
    }
    
    // Si la fecha de inicio está próxima (dentro de los próximos 7 días), está próxima
    const diasHastaInicio = Math.ceil((fechaInicio.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    if (diasHastaInicio <= 7 && diasHastaInicio > 0) {
      return 'PROXIMA';
    }
    
    // Si la fecha de inicio está muy lejos, está confirmada (pero la tratamos como próxima para cancelar)
    return 'CONFIRMADA';
  }

  /**
   * Actualiza el estado de una reserva si es necesario
   */
  actualizarEstadoSiEsNecesario(reserva: Reserva): Reserva {
    const estadoActual = reserva.estado;
    const nuevoEstado = this.determinarEstadoReserva(reserva);
    
    // Solo actualizar si el estado ha cambiado y no es un estado manual (CANCELADA)
    if (estadoActual !== nuevoEstado && estadoActual !== 'CANCELADA') {
      return { ...reserva, estado: nuevoEstado };
    }
    
    return reserva;
  }

  /**
   * Actualiza los estados de una lista de reservas
   */
  actualizarEstadosReservas(reservas: Reserva[]): Reserva[] {
    return reservas.map(reserva => this.actualizarEstadoSiEsNecesario(reserva));
  }

  /**
   * Verifica si una reserva está próxima
   */
  esReservaProxima(reserva: Reserva): boolean {
    return this.determinarEstadoReserva(reserva) === 'PROXIMA';
  }

  /**
   * Verifica si una reserva está activa
   */
  esReservaActiva(reserva: Reserva): boolean {
    return this.determinarEstadoReserva(reserva) === 'ACTIVA';
  }

  /**
   * Verifica si una reserva está confirmada
   */
  esReservaConfirmada(reserva: Reserva): boolean {
    return this.determinarEstadoReserva(reserva) === 'CONFIRMADA';
  }

  /**
   * Verifica si una reserva está finalizada
   */
  esReservaFinalizada(reserva: Reserva): boolean {
    return this.determinarEstadoReserva(reserva) === 'FINALIZADA';
  }

  /**
   * Obtiene información adicional sobre el estado de la reserva
   */
  obtenerInfoEstado(reserva: Reserva): { estado: string, diasRestantes: number, mensaje: string } {
    const estado = this.determinarEstadoReserva(reserva);
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
