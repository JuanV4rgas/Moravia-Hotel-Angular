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
    }
  }
}
