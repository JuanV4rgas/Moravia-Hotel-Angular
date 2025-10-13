// src/app/servicio/service-form/service-form.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Servicio } from 'src/app/model/servicio';
import { ServicioService } from 'src/app/services/servicio.service';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent {
  form: Servicio = {
    idServicio: 0,          // si queda 0, NO se envía
    nombre: '',
    descripcion: '',
    precio: 0,
    imagenUrl: ''
  };

  saving = false;
  error?: string;

  constructor(private service: ServicioService, private router: Router) {}

guardar(): void {
  this.error = undefined;

  const body: any = {
    nombre: (this.form.nombre ?? '').trim(),
    descripcion: (this.form.descripcion ?? '').trim(),
    precio: Number(this.form.precio),
    imagenUrl: (this.form.imagenUrl ?? '').trim()
  };

  if (!body.nombre) { this.error = 'El nombre es obligatorio.'; return; }
  if (Number.isNaN(body.precio)) { this.error = 'El precio debe ser numérico.'; return; }

  this.saving = true;
  this.service.addServicio(body).subscribe({
    next: () => { this.saving = false; this.router.navigate(['/servicio/table']); },
    error: (err) => {
      this.saving = false;
      const backendMsg = err?.error?.message || err?.error?.error || '';
      this.error = `No se pudo crear el servicio. (HTTP ${err?.status ?? '—'}) ${backendMsg}`;
      console.error('Error creando servicio', err);
    }
  });
}


  onClear(): void {
    this.form = { idServicio: 0, nombre: '', descripcion: '', precio: 0, imagenUrl: '' };
    this.error = undefined;
  }

  cancelar(): void {
    this.router.navigate(['/servicio/table']);
  }
}
