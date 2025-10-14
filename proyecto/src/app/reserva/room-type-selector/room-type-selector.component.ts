import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RoomType } from '../../model/reserva';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room-type-selector',
  templateUrl: './room-type-selector.component.html',
  styleUrls: ['./room-type-selector.component.css']
})
export class RoomTypeSelectorComponent implements OnInit {
  @Input() fechaInicio: string = '';
  @Input() fechaFin: string = '';
  @Output() tipoSeleccionado = new EventEmitter<RoomType>();
  @Output() habitacionesDisponibles = new EventEmitter<any[]>();

  roomTypes: RoomType[] = [];
  tipoSeleccionadoActual: RoomType | null = null;
  habitacionesDelTipo: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private roomService: RoomService) {}

  ngOnInit() {
    this.cargarTiposDeHabitacion();
  }

  cargarTiposDeHabitacion() {
    this.isLoading = true;
    this.errorMessage = '';

    this.roomService.getAllRoomTypes().subscribe({
      next: (tipos) => {
        this.roomTypes = tipos;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar tipos de habitación:', error);
        this.errorMessage = 'Error al cargar tipos de habitación';
        this.isLoading = false;
      }
    });
  }

  seleccionarTipo(tipo: RoomType) {
    this.tipoSeleccionadoActual = tipo;
    this.tipoSeleccionado.emit(tipo);
    this.buscarHabitacionesDelTipo(tipo);
  }

  buscarHabitacionesDelTipo(tipo: RoomType) {
    if (!this.fechaInicio || !this.fechaFin) {
      this.errorMessage = 'Por favor selecciona las fechas primero';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.roomService.buscarHabitacionesDisponibles(this.fechaInicio, this.fechaFin)
      .subscribe({
        next: (habitaciones) => {
          // Filtrar habitaciones del tipo seleccionado
          this.habitacionesDelTipo = habitaciones.filter(h => h.type.id === tipo.id);
          this.habitacionesDisponibles.emit(this.habitacionesDelTipo);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al buscar habitaciones:', error);
          this.errorMessage = 'Error al cargar habitaciones disponibles';
          this.isLoading = false;
        }
      });
  }

  getNoches(): number {
    if (!this.fechaInicio || !this.fechaFin) return 0;
    const fechaInicio = new Date(this.fechaInicio);
    const fechaFin = new Date(this.fechaFin);
    return Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
  }
}
