import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Reserva } from '../../model/reserva';
import { ReservaService } from '../../services/reserva.service';
import { CuentaService } from '../../services/cuenta.service';

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
  processingId: number | null = null;
  deletingId: number | null = null;

  constructor(
    private reservaService: ReservaService,
    private cuentaService: CuentaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.loading = true;
    this.error = null;

    console.log('🔄 Cargando reservas...');
    const req: Observable<Reserva[]> = this.reservaService.getAllReservas();
    req.pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          console.log('📋 Reservas cargadas:', data);
          this.reservas = data ?? [];
          console.log('📋 Total de reservas:', this.reservas.length);
          
          // Debug: mostrar estados de las reservas
          this.reservas.forEach((reserva, index) => {
            console.log(`📋 Reserva ${index + 1}: ID=${reserva.id}, Estado=${(reserva as any)?.estado}`);
          });
        },
        error: (err) => {
          console.error('❌ Error al cargar reservas:', err);
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

  // ===== NUEVAS FUNCIONALIDADES PARA OPERADOR =====

  /** Ver detalles de la reserva */
  verDetalleReserva(r: Reserva): void {
    const id = (r as any)?.id;
    if (id == null) return;
    this.router.navigate(['/reserva/detalle', id]);
  }

  /** Gestionar servicios de la reserva */
  gestionarServicios(r: Reserva): void {
    const id = (r as any)?.id;
    if (id == null) return;
    this.router.navigate(['/reserva/servicios', id]);
  }

  /** Activar reserva (cambiar estado a ACTIVA) */
  activarReserva(r: Reserva): void {
    const id = (r as any)?.id;
    if (id == null) return;
    if (!this.puedeActivarReserva(r)) return;

    const ok = confirm('¿Activar esta reserva? El cliente podrá comenzar su estadía.');
    if (!ok) return;

    this.processingId = Number(id);
    const reservaActualizada = { ...(r as any), estado: 'ACTIVA' };

    this.reservaService.updateReserva(reservaActualizada)
      .pipe(finalize(() => { this.processingId = null; }))
      .subscribe({
        next: () => {
          alert('Reserva activada exitosamente');
          this.cargarReservas();
        },
        error: (error) => {
          console.error('Error al activar reserva:', error);
          this.error = 'Error al activar la reserva';
        }
      });
  }

  /** Finalizar reserva (cambiar estado a FINALIZADA) */
  finalizarReserva(r: Reserva): void {
    const id = (r as any)?.id;
    if (id == null) return;
    if (!this.puedeFinalizarReserva(r)) return;

    console.log('🔄 Iniciando finalización de reserva:', r);

    // Verificar que la cuenta esté pagada
    const cuenta = (r as any)?.cuenta;
    if (cuenta && cuenta.total > 0) {
      alert('No se puede finalizar la reserva. La cuenta debe estar pagada primero.');
      return;
    }

    const ok = confirm('¿Finalizar esta reserva? El cliente terminará su estadía.');
    if (!ok) return;

    this.processingId = Number(id);
    const reservaActualizada = { ...(r as any), estado: 'FINALIZADA' };
    
    console.log('📤 Enviando reserva actualizada:', reservaActualizada);
    console.log('📤 Estado a enviar:', reservaActualizada.estado);

    this.reservaService.updateReserva(reservaActualizada)
      .pipe(finalize(() => { this.processingId = null; }))
      .subscribe({
        next: (reservaRespuesta) => {
          console.log('✅ Reserva finalizada exitosamente');
          console.log('📥 Respuesta del servidor:', reservaRespuesta);
          alert('Reserva finalizada exitosamente');
          this.cargarReservas();
        },
        error: (error) => {
          console.error('❌ Error al finalizar reserva:', error);
          this.error = 'Error al finalizar la reserva';
        }
      });
  }

  /** Pagar cuenta de la reserva */
  pagarReserva(r: Reserva): void {
    const id = (r as any)?.id;
    if (id == null) return;
    if (!this.puedePagarReserva(r)) return;

    const cuenta = (r as any)?.cuenta;
    if (!cuenta || cuenta.total <= 0) {
      alert('Esta reserva no tiene cuenta pendiente de pago.');
      return;
    }

    const ok = confirm(`¿Procesar pago de $${cuenta.total}? Esto limpiará la cuenta del cliente.`);
    if (!ok) return;

    this.processingId = Number(id);
    
    // Limpiar la cuenta (establecer total a 0 y limpiar servicios)
    const cuentaLimpia = {
      ...cuenta,
      total: 0,
      servicios: [],
      estado: 'PAGADA'
    };

    this.cuentaService.updateCuenta(cuentaLimpia)
      .pipe(finalize(() => { this.processingId = null; }))
      .subscribe({
        next: () => {
          alert('Pago procesado exitosamente. Cuenta limpiada.');
          this.cargarReservas();
        },
        error: (error) => {
          console.error('Error al procesar pago:', error);
          this.error = 'Error al procesar el pago';
        }
      });
  }

  // ===== VALIDACIONES DE ESTADO =====

  /** Puede gestionar servicios si la reserva está ACTIVA */
  puedeGestionarServicios(r: Reserva): boolean {
    const estado = (r as any)?.estado;
    return estado === 'ACTIVA';
  }

  /** Puede activar si está INACTIVA o CONFIRMADA */
  puedeActivarReserva(r: Reserva): boolean {
    const estado = (r as any)?.estado;
    return estado === 'INACTIVA' || estado === 'CONFIRMADA';
  }

  /** Puede finalizar si está ACTIVA */
  puedeFinalizarReserva(r: Reserva): boolean {
    const estado = (r as any)?.estado;
    return estado === 'ACTIVA';
  }

  /** Puede pagar si tiene cuenta pendiente y está ACTIVA o CONFIRMADA */
  puedePagarReserva(r: Reserva): boolean {
    const estado = (r as any)?.estado;
    const cuenta = (r as any)?.cuenta;
    return (estado === 'ACTIVA' || estado === 'CONFIRMADA') && 
           cuenta && cuenta.total > 0;
  }

  // ===== NUEVAS FUNCIONALIDADES DE ELIMINACIÓN =====

  /** Eliminar reserva (eliminación permanente) */
  eliminarReserva(r: Reserva): void {
    const id = (r as any)?.id;
    if (id == null) return;
    if (!this.puedeEliminarReserva(r)) return;

    const ok = confirm('¿Estás seguro de que quieres ELIMINAR PERMANENTEMENTE esta reserva? Esta acción no se puede deshacer y eliminará todos los datos relacionados.');
    if (!ok) return;

    this.deletingId = Number(id);

    this.reservaService.deleteReserva(id)
      .pipe(finalize(() => { this.deletingId = null; }))
      .subscribe({
        next: () => {
          console.log('✅ Reserva eliminada exitosamente, recargando lista...');
          alert('Reserva eliminada exitosamente');
          
          // Pequeño delay para asegurar que el backend procese la eliminación
          setTimeout(() => {
            console.log('🔄 Recargando reservas después de eliminar...');
            this.cargarReservas();
          }, 500);
        },
        error: (error) => {
          console.error('❌ Error al eliminar reserva:', error);
          this.error = 'Error al eliminar la reserva';
        }
      });
  }

  /** Puede eliminar si la reserva está en estados específicos */
  puedeEliminarReserva(r: Reserva): boolean {
    const estado = (r as any)?.estado;
    // Solo se pueden eliminar reservas canceladas, finalizadas o en ciertos estados
    return ['CANCELADA', 'FINALIZADA', 'PENDIENTE'].includes(estado);
  }
}
