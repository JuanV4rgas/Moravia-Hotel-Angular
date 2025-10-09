import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../model/room';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private apiUrl = 'http://localhost:8081/room';
  constructor(private http: HttpClient) {}

  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/all`);
  }

  getRoom(id: string): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/find/${id}`);
  }

  addRoom(payload: Room): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/add`, payload);
  }


  updateRoom(id: string, payload: Room): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/update/${id}`, payload);
  }

  deleteRoom(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
