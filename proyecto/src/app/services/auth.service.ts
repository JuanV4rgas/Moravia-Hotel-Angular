import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: Usuario| undefined;

  constructor(private http: HttpClient) { }

  login(email: string, clave: string) {
    // Make an HTTP request to authenticate the user
    // Store the user data in the `user` property
  }

  getUser(): Observable<Usuario> {
    // implementation
    return this.http.get<Usuario>('your-api-endpoint');
  }

  logout() {
    this.http.post('your-api-endpoint', {}).subscribe(() => {
      this.user = undefined;
    });
  }
}