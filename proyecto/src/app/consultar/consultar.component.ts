import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css']
})
export class ConsultarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navegarA(entidad: string) {
    switch(entidad) {
      case 'reservas':
        this.router.navigate(['/reserva/all']);
        break;
      case 'habitaciones':
        this.router.navigate(['/room/all']);
        break;
      case 'tipos-habitacion':
        this.router.navigate(['/roomtype/all']);
        break;
      case 'servicios':
        this.router.navigate(['/servicio/all']);
        break;
      case 'usuarios':
        this.router.navigate(['/usuario/all']);
        break;
      case 'cuentas':
        this.router.navigate(['/cuenta/all']);
        break;
    }
  }
}
