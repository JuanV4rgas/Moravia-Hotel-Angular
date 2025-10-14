import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8081/usuario';
  
  // Headers para todas las peticiones POST
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // ======================
  // LISTA DE USUARIOS
  // ======================
  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/all`);
  }

  // ======================
  // BUSCAR USUARIO POR ID
  // ======================
  getUsuarioById(id: number): Observable<Usuario> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<Usuario>(`${this.apiUrl}/find`, { params });
  }

  // ======================
  // CREAR USUARIO
  // ======================
  addUsuario(usuario: Usuario): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, usuario, this.httpOptions);
  }

  // ======================
  // ACTUALIZAR USUARIO
  // ======================
  updateUsuario(id: number, usuario: Usuario): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/update/${id}`, usuario, this.httpOptions);
  }

  // ======================
  // ELIMINAR USUARIO
  // ======================
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // ======================
  // BUSCAR POR EMAIL
  // ======================
  getUsuarioByEmail(email: string): Observable<Usuario> {
    const params = new HttpParams().set('email', email);
    return this.http.get<Usuario>(`${this.apiUrl}/find/email`, { params });
  }

  // ======================
  // COMPATIBILIDAD CON COMPONENTE
  // ======================
  getUsuario(id: number) {
    return this.getUsuarioById(id);
  }
}