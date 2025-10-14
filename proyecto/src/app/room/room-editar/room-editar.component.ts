import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from '../../model/room';
import { RoomType } from '../../model/roomtype';
import { RoomService } from '../../services/room.service';
import { RoomTypeService } from '../../services/roomtype.service';

@Component({
  selector: 'app-room-editar',
  templateUrl: './room-editar.component.html',
})
export class RoomEditarComponent implements OnInit {
  loading = false;
  error?: string;

  roomTypes: RoomType[] = [];

  form: Room = {
    id: 0,
    habitacionNumber: '',
    available: false,
    type: {} as RoomType
  };

  private id!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private roomTypeService: RoomTypeService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.id) {
      this.error = 'ID inválido';
      return;
    }
    this.cargarTipos();
    this.cargarRoom();
  }

  private cargarTipos(): void {
    this.roomTypeService.getAllRoomTypes().subscribe({
      next: (types) => (this.roomTypes = types),
      error: (err) => console.error('Error cargando roomtypes', err),
    });
  }

  private cargarRoom(): void {
    this.loading = true;
    this.roomService.getRoom(Number(this.id)).subscribe({
      next: (room) => {
        this.form = room;
        this.loading = false;
      },
      error: (err) => {
        this.error = `No se pudo cargar la habitación (HTTP ${err?.status ?? '—'})`;
        this.loading = false;
      }
    });
  }

  guardar(): void {
    if (!this.form.habitacionNumber?.trim()) {
      this.error = 'El número de habitación es obligatorio.';
      return;
    }
    if (!this.form.type || !this.form.type.id) {
      this.error = 'Selecciona un tipo de habitación.';
      return;
    }

    this.loading = true;
    this.roomService.updateRoom(Number(this.id), this.form).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/room/table']);
      },
      error: (err) => {
        this.error = `No se pudo actualizar la habitación (HTTP ${err?.status ?? '—'})`;
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/room/table']);
  }
}
