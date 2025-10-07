import { Component, OnInit } from '@angular/core';
import { HabitacionService } from 'src/app/services/habitacion.service';
import { Habitacion } from '../habitacion';

@Component({
  selector: 'app-habitacion-table',
  templateUrl: './habitacion-table.component.html'
})
export class HabitacionTableComponent implements OnInit {
  habitaciones: Habitacion[] = [];

  constructor(private habitacionService: HabitacionService) {}

  ngOnInit(): void {
    this.habitacionService.getHabitaciones().subscribe({
      next: (data) => this.habitaciones = data,
      error: (err) => console.error('Error al cargar habitaciones', err)
    });
  }

  eliminarHabitacion(id: string): void {
    this.habitacionService.deleteHabitacion(id).subscribe(() => {
      this.habitaciones = this.habitaciones.filter(h => h.id !== id);
    });
  }
}
