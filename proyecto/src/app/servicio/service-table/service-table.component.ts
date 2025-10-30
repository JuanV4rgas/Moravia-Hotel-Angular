import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ServicioService } from 'src/app/services/servicio.service';
import { Servicio } from 'src/app/model/servicio';

@Component({
  selector: 'app-service-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './service-table.component.html',
  styleUrls: ['./service-table.component.css']
})
export class ServiceTableComponent implements OnInit {
  servicios: Servicio[] = [];
  loading = false;
  error?: string;

  constructor(private service: ServicioService, private router: Router) {}

  ngOnInit(): void { this.cargar(); }

  private cargar(): void {
    this.loading = true;
    this.service.getAllServicios().subscribe({
      next: (data) => { this.servicios = data; this.loading = false; },
      error: (err) => { 
        this.error = `No se pudieron cargar los servicios (HTTP ${err?.status ?? '—'})`;
        this.loading = false; 
      }
    });
  }

  trackById = (_: number, s: Servicio) => s.idServicio;

  eliminar(id: number, ev?: Event): void {
    ev?.stopPropagation();
    if (!confirm('¿Eliminar este servicio?')) return;
    this.service.deleteServicio(id).subscribe({
      next: () => this.servicios = this.servicios.filter(s => s.idServicio !== id),
      error: () => alert('No se pudo eliminar el servicio.')
    });
  }
}
