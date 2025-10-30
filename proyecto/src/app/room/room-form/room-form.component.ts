import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from 'src/app/model/room';
import { RoomService } from 'src/app/services/room.service';
import { RoomType } from 'src/app/model/reserva';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.css'],
})
export class RoomFormComponent implements OnInit {
  loading = false;
  error = '';
  roomTypes: RoomType[] = [];

  formRoom: Room = {
    id: 0,
    habitacionNumber: '',
    available: false,
    type: {} as RoomType,
  };

  constructor(private roomService: RoomService, private router: Router) {}

  ngOnInit(): void {
    this.cargarRoomTypes();
  }

  private cargarRoomTypes(): void {
    this.loading = true;
    this.roomService.getAllRoomTypes().subscribe({
      next: (types) => {
        this.roomTypes = types ?? [];
        if (this.roomTypes.length) this.formRoom.type = this.roomTypes[0];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar los tipos de habitación.';
        this.loading = false;
      },
    });
  }

  /** ¡IMPORTANTE! Usar función de clase, no arrow inline en la plantilla */
  compareRoomType(a: RoomType | null, b: RoomType | null): boolean {
    if (a === b) return true;
    if (!a || !b) return false;
    return a.id === b.id; // en reserva.ts id es string
  }

  guardar(): void {
  if (!this.formRoom.habitacionNumber || !this.formRoom.type?.id) {
    this.error = 'Complete los campos obligatorios.';
    return;
  }

  // 🔧 Adaptar payload a lo que espera el backend: type={id:<number>}
  const payload = {
    habitacionNumber: this.formRoom.habitacionNumber,
    available: this.formRoom.available,
    type: { id: Number(this.formRoom.type.id) }  // ← id numérico
  } as any;

  this.loading = true;
  this.roomService.addRoom(payload).subscribe({
    next: () => {
      this.loading = false;
      this.router.navigate(['/room/table']);
    },
    error: (err) => {
      console.error('Error creando habitación. Payload enviado:', payload, err);
      this.error = `No se pudo crear la habitación (HTTP ${err?.status ?? '—'})`;
      this.loading = false;
    },
  });
}


  limpiar(): void {
    this.formRoom = {
      id: 0,
      habitacionNumber: '',
      available: false,
      type: this.roomTypes[0] ?? ({} as RoomType),
    };
    this.error = '';
  }
}
