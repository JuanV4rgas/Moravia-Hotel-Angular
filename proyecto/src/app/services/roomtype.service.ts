// src/app/services/roomtype.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomType } from '../model/roomtype';

@Injectable({ providedIn: 'root' })
export class RoomTypeService {
  private apiUrl = 'http://localhost:8081/roomtype';

  constructor(private http: HttpClient) {}

  getAllRoomTypes(): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(`${this.apiUrl}/all`);
  }

  getRoomType(id: string): Observable<RoomType> {
    return this.http.get<RoomType>(`${this.apiUrl}/find/${id}`);
  }

  addRoomType(payload: RoomType): Observable<RoomType> {
    return this.http.post<RoomType>(`${this.apiUrl}/add`, payload);
  }

  updateRoomType(id: string, payload: RoomType): Observable<RoomType> {
    return this.http.post<RoomType>(`${this.apiUrl}/update/${id}`, payload);
  }

  deleteRoomType(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
