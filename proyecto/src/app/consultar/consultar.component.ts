import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../model/usuario';

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css']
})
export class ConsultarComponent implements OnInit {

  usuario!: Usuario | null;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.usuario$.subscribe((usuario) => (this.usuario = usuario));
  }

  navegarA(entidad: string) {
    switch(entidad) {
      case 'reservas':
        this.router.navigate(['/reserva/table']); 
        break;
      case 'habitaciones':
        this.router.navigate(['/room/table']);
        break;
      case 'tipos-habitacion':
        this.router.navigate(['/roomtype/table']);
        break;
      case 'servicios':
        this.router.navigate(['/servicio/table']);
        break;
      case 'usuarios':
        this.router.navigate(['/usuario/table']);
        break;
      case 'cuentas':
        this.router.navigate(['/cuenta/table']);
        break;
      case 'clientes':
        this.router.navigate(['/cliente/table']);
        break;
    }
  }
}
