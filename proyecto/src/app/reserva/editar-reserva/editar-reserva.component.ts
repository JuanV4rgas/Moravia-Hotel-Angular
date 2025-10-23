import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Reserva, RoomType } from '../../model/reserva';
import { Room } from '../../model/room';
import { ReservaService } from '../../services/reserva.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-editar-reserva',
  templateUrl: './editar-reserva.component.html',
  styleUrls: ['./editar-reserva.component.css']
})
export class EditarReservaComponent implements OnInit {
  reservaForm: FormGroup;
  reservaOriginal: Reserva | null = null;
  habitacionesSeleccionadas: Room[] = [];
  habitacionesDisponibles: Room[] = [];
  tipoSeleccionado: RoomType | null = null;
  total: number = 0;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  usuarioActual: Usuario | null = null;
  reservaId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
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
      this.errorMessage = 'Debes estar logueado para editar una reserva';
      return;
    }

    // Validar que sea cliente
    if (this.usuarioActual.tipo !== 'cliente') {
      this.errorMessage = 'Solo los clientes pueden editar reservas';
      return;
    }

    // Obtener ID de la reserva desde la ruta
    this.route.params.subscribe(params => {
      this.reservaId = +params['id'];
      if (this.reservaId) {
        this.cargarReserva();
      }
    });
  }

  cargarReserva() {
    if (!this.reservaId) return;

    this.isLoading = true;
    this.reservaService.getReservaById(this.reservaId).subscribe({
      next: (reserva) => {
        this.reservaOriginal = reserva;
        
        // Verificar que el usuario sea el propietario de la reserva
        if (reserva.cliente.idUsuario !== this.usuarioActual!.idUsuario) {
          this.errorMessage = 'No tienes permisos para editar esta reserva';
          this.isLoading = false;
          return;
        }

        // Verificar que la reserva se pueda editar
        if (!this.puedeEditarReserva(reserva)) {
          this.errorMessage = 'Esta reserva no se puede editar en su estado actual';
          this.isLoading = false;
          return;
        }

        // Cargar datos en el formulario
        this.reservaForm.patchValue({
          fechaInicio: reserva.fechaInicio,
          fechaFin: reserva.fechaFin
        });

        // Cargar habitaciones existentes
        this.habitacionesSeleccionadas = reserva.rooms || [];
        this.total = this.calcularTotalActual();
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar reserva:', error);
        this.errorMessage = 'Error al cargar la reserva';
        this.isLoading = false;
      }
    });
  }

  puedeEditarReserva(reserva: Reserva): boolean {
    // Solo se pueden editar reservas en estado PENDIENTE, CONFIRMADA o PROXIMA
    return ['PENDIENTE', 'CONFIRMADA', 'PROXIMA'].includes(reserva.estado);
  }

  onTipoSeleccionado(tipo: RoomType) {
    this.tipoSeleccionado = tipo;
    // No limpiar habitaciones seleccionadas al cambiar tipo
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

  calcularTotalActual(): number {
    if (!this.habitacionesSeleccionadas.length) return 0;
    return this.habitacionesSeleccionadas.reduce((total, habitacion) => {
      return total + (habitacion.type?.price || 0);
    }, 0);
  }

  onSubmit() {
    if (this.reservaForm.valid && this.habitacionesSeleccionadas.length > 0 && this.reservaOriginal) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const reservaActualizada: Reserva = {
        ...this.reservaOriginal,
        fechaInicio: this.reservaForm.value.fechaInicio,
        fechaFin: this.reservaForm.value.fechaFin,
        rooms: this.habitacionesSeleccionadas.map(
          (h) => ({ id: h.id } as Room)
        ),
      };

      this.reservaService.updateReserva(reservaActualizada).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = '¡Reserva actualizada exitosamente!';
          setTimeout(() => {
            this.router.navigate(['/reserva/detalle', this.reservaId]);
          }, 2000);
        },
        error: (error) => {
          console.error('Error al actualizar reserva:', error);
          this.errorMessage = 'Error al actualizar la reserva. Inténtalo de nuevo.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor completa todos los campos y selecciona al menos una habitación';
    }
  }

  cancelar() {
    this.router.navigate(['/reserva/detalle', this.reservaId]);
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