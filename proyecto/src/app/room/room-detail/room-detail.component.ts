import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Room } from 'src/app/model/room';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.css'],
})
export class RoomDetailComponent implements OnInit {
  loading = false;
  error = '';
  room: Room | null = null;

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

    this.cargarRoom(id);
  }

  private cargarRoom(id: number): void {
    this.loading = true;
    this.error = '';
    this.room = null;

    // 1) Intento con el método existente del service (sin modificarlo)
    this.roomService.getRoomById(id).subscribe({
      next: (r) => {
        this.room = r;
        this.loading = false;
      },
      error: (err1) => {
        // 2) Fallback: listar todo y filtrar por id (sin tocar el service)
        this.roomService.getAllRooms().subscribe({
          next: (lista) => {
            const hallada = (lista ?? []).find(h => Number(h.id) === id) || null;
            if (hallada) {
              this.room = hallada;
              this.loading = false;
            } else {
              const status = err1?.status ?? '—';
              this.error = `No se encontró la habitación con id ${id}. (HTTP ${status})`;
              this.loading = false;
            }
          },
          error: (err2) => {
            const status =
              err2?.status ?? err1?.status ?? '—';
            this.error = `No se pudo cargar la habitación. (HTTP ${status})`;
            this.loading = false;
          },
        });
      },
    });
  }

  volver(): void {
    this.router.navigate(['/room/table']);
  }
}
