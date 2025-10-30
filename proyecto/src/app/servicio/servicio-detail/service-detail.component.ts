import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Servicio } from 'src/app/model/servicio';
import { ServicioService } from 'src/app/services/servicio.service';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  @Input() servicio?: Servicio;

  loading = false;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ServicioService
  ) {}

  ngOnInit(): void {
    // Si llega por ruta /servicio/detail/:id, lo cargamos del back
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!Number.isFinite(id)) {
        this.error = 'ID inválido';
        return;
      }
      this.loading = true;
      this.service.getServicioById(id).subscribe({
        next: (s) => { this.servicio = s; this.loading = false; },
        error: (err) => {
          console.error(err);
          this.error = 'No se pudo cargar el servicio.';
          this.loading = false;
        }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/servicio/table']);
  }
}
