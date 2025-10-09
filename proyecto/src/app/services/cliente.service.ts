// src/app/services/cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../model/cliente';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = 'http://localhost:8081/cliente';

  constructor(private http: HttpClient) {}

  getAllClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/all`);
  }

  // ----- Nombres "oficiales" -----
  getCliente(idUsuario: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/find/${idUsuario}`);
  }

  addCliente(payload: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/add`, payload);
  }

  updateCliente(idUsuario: number, payload: Cliente): Observable<Cliente> {
    // Tu backend usa POST en /update/{id}
    return this.http.post<Cliente>(`${this.apiUrl}/update/${idUsuario}`, payload);
  }

  deleteCliente(idUsuario: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${idUsuario}`);
  }

  // ----- ALIAS para compatibilidad con componentes existentes -----
  /** alias de getCliente */
  getById(idUsuario: number): Observable<Cliente> {
    return this.getCliente(idUsuario);
  }

  /** alias de updateCliente */
  update(idUsuario: number, payload: Cliente): Observable<Cliente> {
    return this.updateCliente(idUsuario, payload);
  }
}
