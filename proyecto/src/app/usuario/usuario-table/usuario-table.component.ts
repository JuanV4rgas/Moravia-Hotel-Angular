import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-usuario-table',
  standalone: true,
  templateUrl: './usuario-table.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./usuario-table.component.css']
})
export class UsuarioTableComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) {}

 loading = true;            // ← agregado
  error?: string;            // ← agregado

 ngOnInit(): void {
  this.usuarioService.getAllUsuarios().subscribe({
    next: (data) => {
      console.log('[Usuarios] GET /usuario/all →', data);
      this.usuarios = data || [];
    },
    error: (err) => {
  console.error('[Usuarios] ERROR /usuario/all', err);
  this.error = err?.status
    ? `No se pudieron cargar los usuarios (HTTP ${err.status})`
    : `No se pudieron cargar los usuarios: ${err?.message ?? 'Error parseando JSON'}`;
  this.loading = false;
}
  });
}

  eliminarUsuario(idUsuario: number): void {
    this.usuarioService.deleteUsuario(idUsuario).subscribe({
      next: () => (this.usuarios = this.usuarios.filter(u => u.idUsuario !== idUsuario)),
      error: (err) => console.error('Error al eliminar usuario', err),
    });
  }
}
