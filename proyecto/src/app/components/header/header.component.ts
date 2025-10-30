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
  loginFadeOut: boolean = false;
  logoutFadeOut: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse al estado de autenticación
    this.authService.authenticated$.subscribe((authenticated) => {
      this.authenticated = authenticated;
      if (authenticated) {
        this.showLoginSuccess();
      }
    });

    // Suscribirse al usuario actual
    this.authService.usuario$.subscribe((usuario) => (this.usuario = usuario));
  }

  showLoginSuccess(): void {
    this.loginSuccess = true;
    this.loginFadeOut = false;

    // Iniciar fade out después de 2.5 segundos
    setTimeout(() => {
      this.loginFadeOut = true;
    }, 2500);

    // Ocultar completamente después de 3 segundos
    setTimeout(() => {
      this.loginSuccess = false;
      this.loginFadeOut = false;
    }, 3000);
  }

  logout(): void {
    this.authService.logout();
    this.showLogoutSuccess();
    this.router.navigate(['/home']);
  }

  showLogoutSuccess(): void {
    this.logoutSuccess = true;
    this.logoutFadeOut = false;

    // Iniciar fade out después de 2.5 segundos
    setTimeout(() => {
      this.logoutFadeOut = true;
    }, 2500);

    // Ocultar completamente después de 3 segundos
    setTimeout(() => {
      this.logoutSuccess = false;
      this.logoutFadeOut = false;
    }, 3000);
  }

  goToProfile(): void {
    this.router.navigate(['/perfil']);
  }
}
