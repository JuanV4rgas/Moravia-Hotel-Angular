import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Room } from '../../model/room';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room-selector',
  templateUrl: './room-selector.component.html',
  styleUrls: ['./room-selector.component.css']
})
export class RoomSelectorComponent implements OnInit, OnChanges {
  @Input() fechaInicio: string = '';
  @Input() fechaFin: string = '';
  @Input() habitacionesDisponibles: Room[] = [];
  @Output() habitacionesSeleccionadas = new EventEmitter<Room[]>();
  @Output() totalCalculado = new EventEmitter<number>();

  habitacionesSeleccionadasList: Room[] = [];
  total: number = 0;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private roomService: RoomService) {}

  ngOnInit() {
    // Ya no necesitamos buscar habitaciones aquí, vienen como input
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['habitacionesDisponibles']) {
      // Limpiar selección si las habitaciones disponibles cambian
      this.habitacionesSeleccionadasList = this.habitacionesSeleccionadasList.filter(
        selectedRoom => this.habitacionesDisponibles.some(availableRoom => availableRoom.id === selectedRoom.id)
      );
      this.calcularTotal();
      this.habitacionesSeleccionadas.emit(this.habitacionesSeleccionadasList);
    }
  }

  toggleHabitacion(habitacion: Room) {
    const index = this.habitacionesSeleccionadasList.findIndex((h: Room) => h.id === habitacion.id);
    
    if (index > -1) {
      // Remover de seleccionadas
      this.habitacionesSeleccionadasList.splice(index, 1);
    } else {
      // Agregar a seleccionadas
      this.habitacionesSeleccionadasList.push(habitacion);
    }

    this.calcularTotal();
    this.habitacionesSeleccionadas.emit(this.habitacionesSeleccionadasList);
  }

  isHabitacionSeleccionada(habitacion: Room): boolean {
    return this.habitacionesSeleccionadasList.some((h: Room) => h.id === habitacion.id);
  }

  calcularTotal() {
    if (!this.fechaInicio || !this.fechaFin) return;

    const fechaInicio = new Date(this.fechaInicio);
    const fechaFin = new Date(this.fechaFin);
    const noches = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));

    this.total = this.habitacionesSeleccionadasList.reduce((sum: number, habitacion: Room) => {
      return sum + (habitacion.type.price * noches);
    }, 0);

    this.totalCalculado.emit(this.total);
  }

  getNoches(): number {
    if (!this.fechaInicio || !this.fechaFin) return 0;
    const fechaInicio = new Date(this.fechaInicio);
    const fechaFin = new Date(this.fechaFin);
    return Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
  }
}
