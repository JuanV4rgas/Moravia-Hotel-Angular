import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitacionService } from 'src/app/services/habitacion.service';
import { Habitacion } from '../habitacion';

@Component({
  selector: 'app-habitacion-form',
  templateUrl: './habitacion-form.component.html'
})
export class HabitacionFormComponent implements OnInit {
  habitacion: Habitacion = {
    id: '',
    name: '',
    description: '',
    price: 0,
    capacity: '',
    numberOfBeds: 0,
    image: '',
    type: ''
  };

  modoEdicion = false; // false = crear, true = editar

  constructor(
    private habitacionService: HabitacionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.habitacionService.getHabitacion(id).subscribe({
        next: (data) => this.habitacion = data,
        error: (err) => console.error('Error al cargar habitación', err)
      });
    }
  }

  guardar(): void {
    if (this.modoEdicion) {
      this.habitacionService.updateHabitacion(this.habitacion.id, this.habitacion).subscribe({
        next: () => {
          console.log('Habitación actualizada');
          this.router.navigate(['/habitaciones']);
        },
        error: (err) => console.error('Error al actualizar la habitación', err)
      });
    } else {
      this.habitacionService.addHabitacion(this.habitacion).subscribe({
        next: () => {
          console.log('Habitación creada');
          this.router.navigate(['/habitaciones']);
        },
        error: (err) => console.error('Error al crear la habitación', err)
      });
    }
  }
}
