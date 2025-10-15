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
  roomTypesOriginales: RoomType[] = [];
  tipoSeleccionadoActual: RoomType | null = null;
  habitacionesDelTipo: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  
  // Filtros
  filtroPrecio: string = '';
  filtroCamas: string = '';

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
        this.roomTypesOriginales = [...tipos];
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

  aplicarFiltros() {
    let tiposFiltrados = [...this.roomTypesOriginales];

    // Aplicar filtro de precio
    if (this.filtroPrecio === 'menor-mayor') {
      tiposFiltrados.sort((a, b) => a.price - b.price);
    } else if (this.filtroPrecio === 'mayor-menor') {
      tiposFiltrados.sort((a, b) => b.price - a.price);
    }

    // Aplicar filtro de número de camas
    if (this.filtroCamas === 'menor-mayor') {
      tiposFiltrados.sort((a, b) => a.numberOfBeds - b.numberOfBeds);
    } else if (this.filtroCamas === 'mayor-menor') {
      tiposFiltrados.sort((a, b) => b.numberOfBeds - a.numberOfBeds);
    }

    this.roomTypes = tiposFiltrados;
  }

  limpiarFiltros() {
    this.filtroPrecio = '';
    this.filtroCamas = '';
    this.roomTypes = [...this.roomTypesOriginales];
  }

  getRoomTypeImage(tipo: RoomType): string {
    // Si el tipo tiene una imagen específica del backend, usarla directamente
    if (tipo.image && tipo.image !== '' && tipo.image.startsWith('http')) {
      return tipo.image;
    }
    
    // Si no, usar una imagen por defecto basada en el tipo
    const imageMap: { [key: string]: string } = {
      'Suite': 'image1817.png',
      'Doble': 'image1822.png',
      'Sencilla': 'image1854.png',
      'Loft': 'image1911.png'
    };
    
    const defaultImage = imageMap[tipo.type] || 'image1817.png';
    return `assets/img/${defaultImage}`;
  }

  onImageError(event: any) {
    // Si la imagen falla, usar una imagen por defecto
    event.target.src = 'assets/img/image1817.png';
  }
}
