import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  // Simulando datos del usuario - en una app real vendrían de un servicio
  authenticated = false; // Cambiar según tu lógica de autenticación
  usuario = {
    nombre: 'Usuario Demo',
    email: 'usuario@ejemplo.com',
    fotoPerfil: '',
    idUsuario: 1
  };

  // Mensajes de estado
  loginSuccess = false;
  logoutSuccess = false;

  constructor() { }

  ngOnInit(): void {
    // Aquí inicializarías la verificación de autenticación
    // this.checkAuthentication();
  }

  toggleOffcanvas(): void {
    // Lógica para manejar el toggle del offcanvas
    // En Angular, podrías usar una variable de estado local
    // o integrar con Bootstrap JS
  }

  logout(): void {
    // Lógica de logout
    this.authenticated = false;
    this.logoutSuccess = true;
    // Redirigir o mostrar mensaje
  }

  dismissAlert(): void {
    this.loginSuccess = false;
    this.logoutSuccess = false;
  }
}