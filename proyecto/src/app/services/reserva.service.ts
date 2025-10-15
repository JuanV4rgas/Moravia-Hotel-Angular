import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../model/reserva';
import { Room } from '../model/room';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:8081/reserva';

  constructor(private http: HttpClient) { }

  /**
   * Obtener todas las reservas
   */
  getAllReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/all`);
  }

  /**
   * Obtener reserva por ID
   */
  getReservaById(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/find/${id}`);
  }

  /**
   * Crear nueva reserva
   */
  createReserva(reserva: Reserva): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, reserva);
  }

  /**
   * Actualizar reserva
   */
  updateReserva(reserva: Reserva): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update/${reserva.id}`, reserva);
  }

  /**
   * Eliminar reserva
   */
  deleteReserva(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  /**
   * Buscar habitaciones disponibles
   */
  buscarHabitacionesDisponibles(fechaInicio: string, fechaFin: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/habitaciones-disponibles?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
}
