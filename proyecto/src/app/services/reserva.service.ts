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

  // Todos los métodos ya retornan DTOs desde el backend
  getAllReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/all`);
  }

  getReservaById(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/find/${id}`);
  }

  // El backend espera CrearReservaRequestDTO
  createReserva(reserva: any): Observable<Reserva> {
    const requestDTO = {
      fechaInicio: reserva.fechaInicio,
      fechaFin: reserva.fechaFin,
      estado: reserva.estado,
      clienteId: reserva.cliente.idUsuario,
      roomIds: reserva.rooms.map((r: any) => r.id)
    };
    
    return this.http.post<Reserva>(`${this.apiUrl}/add`, requestDTO);
  }

  // El backend espera ActualizarReservaRequestDTO
  updateReserva(reserva: Reserva): Observable<Reserva> {
    const requestDTO = {
      fechaInicio: reserva.fechaInicio,
      fechaFin: reserva.fechaFin,
      estado: reserva.estado,
      roomIds: reserva.rooms?.map(r => r.id)
    };
    
    return this.http.put<Reserva>(`${this.apiUrl}/update/${reserva.id}`, requestDTO);
  }

  deleteReserva(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  buscarHabitacionesDisponibles(fechaInicio: string, fechaFin: string): Observable<Room[]> {
    return this.http.get<Room[]>(
      `${this.apiUrl}/checkDisponibilidad?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
  }
}