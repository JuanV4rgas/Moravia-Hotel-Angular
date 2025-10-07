import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../model/servicio';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private apiUrl = 'http://localhost:8081/servicio'; // Adjust if backend port differs

  constructor(private http: HttpClient) { }

  getAllServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/all`);
  }

  getServicioById(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.apiUrl}/find/${id}`);
  }
}
