import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  authenticated: boolean = false;
  usuario: Usuario | null = null;
  loginSuccess: boolean = false;
  logoutSuccess: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  ngOnInit(): void {
    // Suscribirse al estado de autenticación
    this.authService.authenticated$.subscribe(
      authenticated => this.authenticated = authenticated
    );

    // Suscribirse al usuario actual
    this.authService.usuario$.subscribe(
      usuario => this.usuario = usuario
    );

    this.loginSuccess = this.authenticated
  }

  logout(): void {
    this.authService.logout();
    this.logoutSuccess = true;
  }

  goToProfile(): void {
    this.router.navigate(['/perfil']);
  }
}