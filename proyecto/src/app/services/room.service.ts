import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../model/room';
import { RoomType } from '../model/reserva';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8081/room';

  constructor(private http: HttpClient) { }

  /**
   * Obtener todas las habitaciones
   */
  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/all`);
  }

  /**
   * Obtener habitación por ID
   */
  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/find?id=${id}`);
  }

  /**
   * Obtener todos los tipos de habitación
   */
  getAllRoomTypes(): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(`http://localhost:8081/roomtype/all`);
  }

  /**
   * Buscar habitaciones disponibles por fechas
   */
  buscarHabitacionesDisponibles(fechaInicio: string, fechaFin: string): Observable<Room[]> {
    return this.http.get<Room[]>(`http://localhost:8081/reserva/checkDisponibilidad?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  /**
   * Obtener habitación por ID (método individual)
   */
  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/find?id=${id}`);
  }

  /**
   * Agregar nueva habitación
   */
  addRoom(room: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, room);
  }

  /**
   * Actualizar habitación
   */
  updateRoom(id: number, room: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, room);
  }

  /**
   * Eliminar habitación
   */
  deleteRoom(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }
}