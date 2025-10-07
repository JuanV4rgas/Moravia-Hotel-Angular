import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomType } from '../model/roomtype';

@Injectable({ providedIn: 'root' })
export class RoomTypeService {
  private apiUrl = 'http://localhost:8081/api/roomtypes';
  constructor(private http: HttpClient) {}

  getAllRoomTypes(): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(`${this.apiUrl}/all`);
  }

  getRoomType(id: string): Observable<RoomType> {
    return this.http.get<RoomType>(`${this.apiUrl}/${id}`);
  }

  addRoomType(payload: RoomType): Observable<RoomType> {
    return this.http.post<RoomType>(this.apiUrl, payload);
  }

  updateRoomType(id: string, payload: RoomType): Observable<RoomType> {
    return this.http.put<RoomType>(`${this.apiUrl}/${id}`, payload);
  }

  deleteRoomType(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
