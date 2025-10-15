import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../model/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8081/room';

  constructor(private http: HttpClient) { }

  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/all`);
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/find/${id}`);
  }

  addRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/add`, room);
  }

  updateRoom(room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/update/${room.id}`, room);
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // Métodos adicionales para compatibilidad con componentes existentes
  getAllRoomTypes(): Observable<any[]> {
    // Este método debería llamar al servicio de roomtypes, pero por compatibilidad
    // retornamos un observable vacío
    return this.http.get<any[]>(`http://localhost:8081/roomtype/all`);
  }

  buscarHabitacionesDisponibles(fechaInicio: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8081/reserva/checkDisponibilidad?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
}
