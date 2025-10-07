import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HabitacionService } from 'src/app/services/habitacion.service';
import { Habitacion } from '../habitacion';

@Component({
  selector: 'app-habitacion-detail',
  templateUrl: './habitacion-detail.component.html'
})
export class HabitacionDetailComponent implements OnInit {
  habitacion?: Habitacion;

  constructor(
    private route: ActivatedRoute,
    private habitacionService: HabitacionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.habitacionService.getHabitacion(id).subscribe({
      next: (data) => this.habitacion = data,
      error: (err) => console.error('Error al cargar habitación', err)
    });
  }
}
