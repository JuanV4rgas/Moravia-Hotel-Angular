import { Component } from '@angular/core';

interface Usuario {
  idUsuario: number;
  email: string;
  clave: string;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  fotoPerfil: string;
}

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.css'],
})
export class UserDropdownComponent {
  usuario: Usuario = {
    idUsuario: 1,
    email: 'juan.perez@example.com',
    clave: 'clave123',
    nombre: 'Juan',
    apellido: 'Pérez',
    cedula: '1234567890',
    telefono: '+57 3001234567',
    fotoPerfil: 'https://randomuser.me/api/portraits/men/1.jpg',
  };
}
