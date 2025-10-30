import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Servicio } from 'src/app/model/servicio';
import { ServicioService } from 'src/app/services/servicio.service';

@Component({
  selector: 'app-service-editar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './service-editar.component.html',
  styleUrls: ['./service-editar.component.css']
})
export class ServiceEditarComponent implements OnInit {
  loading = false;
  error?: string;
  id!: number;

  form: Servicio = {
    idServicio: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    imagenUrl: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ServicioService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || !Number.isFinite(Number(idParam))) {
      this.error = 'ID inválido';
      return;
    }
    this.id = Number(idParam);
    this.cargar();
  }

  private cargar(): void {
    this.loading = true;
    this.service.getServicioById(this.id).subscribe({
      next: (s) => { this.form = { ...s }; this.loading = false; },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar el servicio.';
        this.loading = false;
      }
    });
  }

  guardar(): void {
    if (!this.form.nombre.trim()) {
      this.error = 'El nombre es obligatorio.';
      return;
    }
    this.loading = true;
    this.form.idServicio = this.id;
    this.service.updateServicio(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/servicio/table']);
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo actualizar el servicio.';
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/servicio/table']);
  }
}
