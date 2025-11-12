import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError, switchMap, map } from 'rxjs/operators';
import { Usuario } from '../model/usuario';
import { UsuarioService } from './usuario.service';

interface LoginResponse {
  token: string;
  refreshToken: string;
  idUsuario: number;
  email: string;
  nombre?: string;
  tipo?: string;
  roles?: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8081/usuario';
  private authApiUrl = 'http://localhost:8081/api/auth';

  private usuarioSubject: BehaviorSubject<Usuario | null>;
  public usuario$: Observable<Usuario | null>;

  private authenticatedSubject: BehaviorSubject<boolean>;
  public authenticated$: Observable<boolean>;

  constructor(private http: HttpClient, private usuarioService: UsuarioService) {
    const storedUser = this.getStoredItem('usuario');
    const initialUser = storedUser ? (JSON.parse(storedUser) as Usuario) : null;
    const authenticatedFlag = this.getStoredItem('authenticated') === 'true';
    const initialAuthenticated = authenticatedFlag || !!initialUser;

    this.usuarioSubject = new BehaviorSubject<Usuario | null>(initialUser);
    this.usuario$ = this.usuarioSubject.asObservable();

    this.authenticatedSubject = new BehaviorSubject<boolean>(initialAuthenticated);
    this.authenticated$ = this.authenticatedSubject.asObservable();
  }

  public get usuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  public get isAuthenticated(): boolean {
    return this.authenticatedSubject.value;
  }

  login(email: string, clave: string): Observable<Usuario> {
    return this.http
      .post<LoginResponse>(`${this.authApiUrl}/login`, { email, clave })
      .pipe(
        switchMap((resp) => {
          this.persistTokens(resp);
          return this.usuarioService.getUsuarioByEmail(email).pipe(
            tap((usuario) => this.persistUser(usuario)),
            catchError((err) => {
              console.warn('No se pudo obtener el usuario por email. Usando datos mínimos.', err);
              const usuarioMinimo = this.buildUsuarioFallback(resp, email);
              this.persistUser(usuarioMinimo);
              return of(usuarioMinimo);
            })
          );
        }),
        catchError((error) => {
          this.clearSession();
          return throwError(() => error);
        })
      );
  }

  register(usuario: Usuario): Observable<void> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<void>(`${this.apiUrl}/add`, usuario, { headers }).pipe(
      tap(() => console.log('Usuario registrado exitosamente')),
      catchError((error) => {
        console.error('Error en registro:', error);
        return throwError(() => new Error('Error al registrar usuario'));
      })
    );
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http
        .post(`${this.authApiUrl}/logout`, { refreshToken })
        .subscribe({ error: () => null });
    }
    this.clearSession();
    console.log('Sesion cerrada');
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No hay refresh token almacenado'));
    }

    return this.http
      .post<LoginResponse>(`${this.authApiUrl}/refresh`, { refreshToken })
      .pipe(
        tap((resp) => {
          this.persistTokens(resp);
          const currentUser = this.usuarioActual;
          const email = resp.email || currentUser?.email || '';
          if (!currentUser) {
            const usuarioMinimo = this.buildUsuarioFallback(resp, email);
            this.persistUser(usuarioMinimo);
          } else if ((currentUser.idUsuario === -1 || currentUser.idUsuario == null) && resp.idUsuario) {
            const actualizado: Usuario = {
              ...currentUser,
              idUsuario: resp.idUsuario,
              tipo: this.resolveTipo(resp.tipo, resp.roles),
            };
            this.persistUser(actualizado);
          }
        }),
        map((resp) => resp.token),
        catchError((error) => {
          console.error('Error al refrescar token', error);
          this.clearSession();
          return throwError(() => new Error('Sesión expirada, inicia sesión de nuevo.'));
        })
      );
  }

  getUser(): Observable<Usuario | null> {
    return this.usuario$;
  }

  hasRole(role: string): boolean {
    const usuario = this.usuarioActual;
    return usuario ? usuario.tipo === role : false;
  }

  updateCurrentUser(usuario: Usuario): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/update/${usuario.idUsuario}`, usuario).pipe(
      tap(() => {
        this.persistUser(usuario);
        console.log('Usuario actualizado');
      }),
      catchError((error) => {
        console.error('Error al actualizar usuario:', error);
        return throwError(() => new Error('Error al actualizar usuario'));
      })
    );
  }

  getToken(): string | null {
    return this.getStoredItem('token');
  }

  getRefreshToken(): string | null {
    return this.getStoredItem('refreshToken');
  }

  private persistTokens(resp: LoginResponse): void {
    this.setItem('token', resp.token);
    if (resp.refreshToken) {
      this.setItem('refreshToken', resp.refreshToken);
    }
    if (resp.roles) {
      this.setItem('roles', JSON.stringify(resp.roles));
    }
  }

  private persistUser(usuario: Usuario): void {
    this.setItem('usuario', JSON.stringify(usuario));
    this.setItem('authenticated', 'true');
    this.usuarioSubject.next(usuario);
    this.authenticatedSubject.next(true);
  }

  private clearSession(): void {
    ['usuario', 'authenticated', 'token', 'refreshToken', 'roles'].forEach((key) => {
      this.removeItem(key);
    });
    this.usuarioSubject.next(null);
    this.authenticatedSubject.next(false);
  }

  private buildUsuarioFallback(resp: LoginResponse, email: string): Usuario {
    return {
      idUsuario: resp.idUsuario ?? -1,
      email,
      clave: '',
      nombre: resp.nombre || '',
      apellido: '',
      cedula: '',
      telefono: '',
      fotoPerfil: '',
      tipo: this.resolveTipo(resp.tipo, resp.roles),
      reservas: [],
    } as Usuario;
  }

  private resolveTipo(tipo?: string, roles?: string[]): Usuario['tipo'] {
    if (tipo && ['cliente', 'administrador', 'operador'].includes(tipo)) {
      return tipo as Usuario['tipo'];
    }
    const normalizedRoles = roles?.map((r) => r.toUpperCase()) || [];
    if (normalizedRoles.some((r) => r.includes('ADMIN'))) {
      return 'administrador';
    }
    if (normalizedRoles.some((r) => r.includes('OPERADOR'))) {
      return 'operador';
    }
    return 'cliente';
  }

  private getStoredItem(key: string): string | null {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key);
  }

  private setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
    sessionStorage.setItem(key, value);
  }

  private removeItem(key: string): void {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}
