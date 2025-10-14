import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reserva, RoomType } from '../../model/reserva';
import { Room } from '../../model/room';
import { ReservaService } from '../../services/reserva.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-reserva-form',
  templateUrl: './reserva-form.component.html',
  styleUrls: ['./reserva-form.component.css']
})
export class ReservaFormComponent implements OnInit {
  reservaForm: FormGroup;
  habitacionesSeleccionadas: Room[] = [];
  habitacionesDisponibles: Room[] = [];
  tipoSeleccionado: RoomType | null = null;
  total: number = 0;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  usuarioActual: Usuario | null = null;

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService,
    private authService: AuthService
  ) {
    this.reservaForm = this.fb.group({
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Obtener usuario actual
    this.usuarioActual = this.authService.usuarioActual;
    
    if (!this.usuarioActual) {
      this.errorMessage = 'Debes estar logueado para hacer una reserva';
      return;
    }

    // Validar que sea cliente
    if (this.usuarioActual.tipo !== 'cliente') {
      this.errorMessage = 'Solo los clientes pueden hacer reservas';
      return;
    }
  }

  onTipoSeleccionado(tipo: RoomType) {
    this.tipoSeleccionado = tipo;
    this.habitacionesSeleccionadas = [];
    this.total = 0;
  }

  onHabitacionesDisponibles(habitaciones: Room[]) {
    this.habitacionesDisponibles = habitaciones;
  }

  onHabitacionesSeleccionadas(habitaciones: Room[]) {
    this.habitacionesSeleccionadas = habitaciones;
  }

  onTotalCalculado(total: number) {
    this.total = total;
  }

  onSubmit() {
    if (this.reservaForm.valid && this.habitacionesSeleccionadas.length > 0) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const reserva: Reserva = {
        fechaInicio: this.reservaForm.value.fechaInicio,
        fechaFin: this.reservaForm.value.fechaFin,
        estado: 'PENDIENTE',
        cliente: {
          idUsuario: this.usuarioActual!.idUsuario,
          nombre: this.usuarioActual!.nombre,
          apellido: this.usuarioActual!.apellido,
          email: this.usuarioActual!.email
        },
        rooms: this.habitacionesSeleccionadas
      };

      this.reservaService.createReserva(reserva).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = '¡Reserva creada exitosamente!';
          this.reservaForm.reset();
          this.habitacionesSeleccionadas = [];
          this.total = 0;
        },
        error: (error) => {
          console.error('Error al crear reserva:', error);
          this.errorMessage = 'Error al crear la reserva. Inténtalo de nuevo.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor completa todos los campos y selecciona al menos una habitación';
    }
  }

  getFechaInicio(): string {
    return this.reservaForm.get('fechaInicio')?.value || '';
  }

  getFechaFin(): string {
    return this.reservaForm.get('fechaFin')?.value || '';
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getMinEndDate(): string {
    const fechaInicio = this.reservaForm.get('fechaInicio')?.value;
    if (fechaInicio) {
      const fecha = new Date(fechaInicio);
      fecha.setDate(fecha.getDate() + 1);
      return fecha.toISOString().split('T')[0];
    }
    return this.getTodayDate();
  }
}
