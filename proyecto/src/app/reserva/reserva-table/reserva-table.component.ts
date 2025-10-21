import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Reserva } from '../../model/reserva';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-reserva-table',
  templateUrl: './reserva-table.component.html',
  styleUrls: ['./reserva-table.component.css']
})
export class ReservaTableComponent implements OnInit {

  reservas: Reserva[] = [];
  loading = false;
  error: string | null = null;

  /** id de la fila que se está cancelando (para deshabilitar solo ese botón) */
  cancellingId: number | null = null;

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  private cargarReservas(): void {
    this.loading = true;
    this.error = null;

    const req: Observable<Reserva[]> = this.reservaService.getAllReservas();
    req.pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => this.reservas = data ?? [],
        error: (err) => {
          console.error(err);
          this.error = 'No se pudieron cargar las reservas.';
        }
      });
  }

  trackById(index: number, r: Reserva): number {
    const anyR: any = r;
    return (anyR && anyR.id != null) ? Number(anyR.id) : index;
  }

  /** Se puede cancelar si el estado es PROXIMA o CONFIRMADA (como en detalle-reserva) */
  puedeCancelarReserva(r: Reserva): boolean {
    const estado = (r as any)?.estado;
    if (!estado) return false;
    const up = String(estado).toUpperCase();
    return up === 'PROXIMA' || up === 'CONFIRMADA';
  }

  /** Concatena los habitacionNumber de todas las rooms */
  roomNumOf(r: Reserva): string {
    const rooms: any[] = (r as any)?.rooms;
    if (!Array.isArray(rooms)) return '-';
    const nums = rooms
      .map((rm: any) => rm?.habitacionNumber != null ? String(rm.habitacionNumber).trim() : '')
      .filter((v: string) => v.length > 0);
    return nums.length ? nums.join(', ') : '-';
  }

  /** Igual que en DetalleReservaComponent.cancelarReserva() */
  cancelarReserva(r: Reserva): void {
    const id = (r as any)?.id;
    if (id == null) return;
    if (!this.puedeCancelarReserva(r)) return;

    const ok = confirm('¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer.');
    if (!ok) return;

    this.cancellingId = Number(id);

    const reservaActualizada = { ...(r as any), estado: 'CANCELADA' };

    this.reservaService.updateReserva(reservaActualizada)
      .pipe(finalize(() => { this.cancellingId = null; }))
      .subscribe({
        next: () => {
          // Mismo comportamiento que tu detalle: recargar la página
          window.location.reload();
        },
        error: (error) => {
          console.error('Error al cancelar reserva:', error);
          this.error = 'Error al cancelar la reserva';
        }
      });
  }
}
