import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8081/usuario';

  constructor(private http: HttpClient) {}

  // Ya retorna UsuarioResponseDTO (sin reservas)
  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/all`);
  }

  // Ya retorna UsuarioResponseDTO
  getUsuarioById(id: number): Observable<Usuario> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<Usuario>(`${this.apiUrl}/find`, { params });
  }

  // Nuevo: obtener usuario CON reservas
  getUsuarioConReservas(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<any>(`${this.apiUrl}/find/id`, { params });
  }

  // Envía CrearUsuarioRequestDTO
  addUsuario(usuario: Usuario): Observable<Usuario> {
    const requestDTO = {
      email: usuario.email,
      clave: usuario.clave,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      cedula: usuario.cedula,
      telefono: usuario.telefono,
      fotoPerfil: usuario.fotoPerfil,
      tipo: usuario.tipo
    };
    
    return this.http.post<Usuario>(`${this.apiUrl}/add`, requestDTO);
  }

  // Envía ActualizarUsuarioRequestDTO
  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    const requestDTO = {
      email: usuario.email,
      clave: usuario.clave || undefined, // solo si se cambió
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      cedula: usuario.cedula,
      telefono: usuario.telefono,
      fotoPerfil: usuario.fotoPerfil,
      tipo: usuario.tipo
    };
    
    return this.http.post<Usuario>(`${this.apiUrl}/update/${id}`, requestDTO);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  getUsuarioByEmail(email: string): Observable<Usuario> {
    const params = new HttpParams().set('email', email);
    return this.http.get<Usuario>(`${this.apiUrl}/find/email`, { params });
  }

  // Alias para compatibilidad
  getUsuario(id: number) {
    return this.getUsuarioById(id);
  }
}