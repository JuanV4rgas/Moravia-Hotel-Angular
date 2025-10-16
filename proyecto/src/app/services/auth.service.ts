import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/usuario';

  // BehaviorSubject para mantener el estado del usuario
  private usuarioSubject: BehaviorSubject<Usuario | null>;
  public usuario$: Observable<Usuario | null>;

  // BehaviorSubject para el estado de autenticación
  private authenticatedSubject: BehaviorSubject<boolean>;
  public authenticated$: Observable<boolean>;

  constructor(private http: HttpClient) {
    // Intentar recuperar usuario del sessionStorage al iniciar
    const storedUser = sessionStorage.getItem('usuario');
    const initialUser = storedUser ? JSON.parse(storedUser) : null;

    this.usuarioSubject = new BehaviorSubject<Usuario | null>(initialUser);
    this.usuario$ = this.usuarioSubject.asObservable();

    this.authenticatedSubject = new BehaviorSubject<boolean>(!!initialUser);
    this.authenticated$ = this.authenticatedSubject.asObservable();
  }

  /**
   * Getter para obtener el valor actual del usuario
   */
  public get usuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  /**
   * Getter para saber si está autenticado
   */
  public get isAuthenticated(): boolean {
    return this.authenticatedSubject.value;
  }

  /**
   * Login: busca usuario por email y valida contraseña
   */
  login(email: string, clave: string): Observable<Usuario> {
    return this.http
      .get<Usuario>(`${this.apiUrl}/find/email?email=${email}`)
      .pipe(
        map((usuario) => {
          // Validar contraseña
          if (usuario && usuario.clave === clave) {
            // Guardar usuario en sessionStorage
            sessionStorage.setItem('usuario', JSON.stringify(usuario));
            sessionStorage.setItem('authenticated', 'true');

            // Actualizar BehaviorSubjects
            this.usuarioSubject.next(usuario);
            this.authenticatedSubject.next(true);

            return usuario;
          } else {
            throw new Error('Contraseña o email incorrectos');
          }
        }),
        catchError((error) => {
          console.error('Error en login:', error);
          return throwError(
            () => new Error(error.message || 'Error al iniciar sesión')
          );
        })
      );
  }

  /**
   * Registro: crear nuevo usuario
   */
  register(usuario: Usuario): Observable<void> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<void>(`${this.apiUrl}/add`, usuario, { headers }).pipe(
      tap(() => {
        console.log('Usuario registrado exitosamente');
      }),
      catchError((error) => {
        console.error('Error en registro:', error);
        return throwError(() => new Error('Error al registrar usuario'));
      })
    );
  }

  /**
   * Logout: limpiar sesión
   */
  logout(): void {
    // Limpiar sessionStorage
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('authenticated');

    // Actualizar BehaviorSubjects
    this.usuarioSubject.next(null);
    this.authenticatedSubject.next(false);

    console.log('Sesión cerrada');
  }

  /**
   * Obtener usuario actual (observable)
   */
  getUser(): Observable<Usuario | null> {
    return this.usuario$;
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const usuario = this.usuarioActual;
    return usuario ? usuario.tipo === role : false;
  }
  

  /**
   * Actualizar información del usuario actual
   */
  updateCurrentUser(usuario: Usuario): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/update/${usuario.idUsuario}`, usuario)
      .pipe(
        tap(() => {
          // Actualizar en sessionStorage y BehaviorSubject
          sessionStorage.setItem('usuario', JSON.stringify(usuario));
          this.usuarioSubject.next(usuario);
          console.log('Usuario actualizado');
        }),
        catchError((error) => {
          console.error('Error al actualizar usuario:', error);
          return throwError(() => new Error('Error al actualizar usuario'));
        })
      );
  }
}
