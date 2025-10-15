import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suites',
  templateUrl: './suites.component.html',
  styleUrls: ['./suites.component.css']
})
export class SuitesComponent {

  constructor(private router: Router) {}

  irAReserva() {
    this.router.navigate(['/reserva/nueva']);
  }

}
