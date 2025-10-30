import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Room } from 'src/app/model/room';
import { RoomType } from 'src/app/model/reserva';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-room-editar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './room-editar.component.html',
  styleUrls: ['./room-editar.component.css'],
})
export class RoomEditarComponent implements OnInit {
  loading = false;
  error = '';

  roomTypes: RoomType[] = [];
  form: Room = {
    id: 0,
    habitacionNumber: '',
    available: false,
    type: {} as RoomType,
  };

  private editId = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    const raw = this.route.snapshot.paramMap.get('id');
    const id = raw ? Number(raw) : NaN;
    if (!id || Number.isNaN(id)) {
      this.error = `ID inválido: "${raw}"`;
      return;
    }
    this.editId = id;
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.loading = true;
    this.error = '';

    this.roomService.getAllRoomTypes().subscribe({
      next: (types) => {
        this.roomTypes = types ?? [];
        this.roomService.getRoomById(this.editId).subscribe({
          next: (room) => {
            this.hidratarFormulario(room);
            this.loading = false;
          },
          error: (err1) => {
            // Fallback: por si /find?id= falla, listar y filtrar
            this.roomService.getAllRooms().subscribe({
              next: (lista) => {
                const hallada = (lista ?? []).find(h => Number(h.id) === this.editId) || null;
                if (hallada) {
                  this.hidratarFormulario(hallada);
                  this.loading = false;
                } else {
                  const status = err1?.status ?? '—';
                  this.error = `No se encontró la habitación con id ${this.editId}. (HTTP ${status})`;
                  this.loading = false;
                }
              },
              error: (err2) => {
                const status = err2?.status ?? err1?.status ?? '—';
                this.error = `No se pudo cargar la habitación. (HTTP ${status})`;
                this.loading = false;
              },
            });
          },
        });
      },
      error: () => {
        this.error = 'No se pudieron cargar los tipos de habitación.';
        this.loading = false;
      },
    });
  }

  private hidratarFormulario(room: Room): void {
    this.form = room;
    if (this.form?.type?.id && this.roomTypes.length) {
      const match = this.roomTypes.find(t => t.id === this.form.type.id);
      if (match) this.form.type = match;
    } else if (this.roomTypes.length && !this.form.type) {
      this.form.type = this.roomTypes[0];
    }
  }

  // Para [compareWith] del <select>
  compareRoomType(a: RoomType | null, b: RoomType | null): boolean {
    if (a === b) return true;
    if (!a || !b) return false;
    return a.id === b.id;
  }

  guardar(): void {
    if (!this.editId) {
      this.error = 'ID inválido.';
      return;
    }
    if (!this.form.type?.id) {
      this.error = 'Debes seleccionar un tipo de habitación.';
      return;
    }

    // Solo se actualizan type y available; habitacionNumber se envía en solo-lectura
    const payload: any = {
      id: this.editId,
      habitacionNumber: this.form.habitacionNumber,
      available: this.form.available,
      type: { id: Number(this.form.type.id) }, // usa String(...) si tu API lo espera texto
    };

    this.loading = true;
    payload.id = this.editId;
    this.roomService.updateRoom(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/room/table']);
      },
      error: (err) => {
        const status = err?.status ?? '—';
        this.error = `No se pudo actualizar la habitación (HTTP ${status})`;
        this.loading = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/room/table']);
  }
}
