import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario-table',
  standalone: true,
  templateUrl: './usuario-table.component.html',
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['./usuario-table.component.css'],
})
export class UsuarioTableComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  loading = true;
  error?: string;
  // Filtros
  filtroTipo: string = 'TODOS';
  filtroBusqueda: string = '';

  // Tipos disponibles para el filtro
  tiposDisponibles: string[] = [
    'TODOS',
    'CLIENTE',
    'OPERADOR',
    'ADMINISTRADOR',
  ];

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.usuarioService.getAllUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los usuarios.';
        console.error(err);
        this.loading = false;
      },
    });
  }

  eliminar(idUsuario: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.usuarioService.deleteUsuario(idUsuario).subscribe({
      next: () =>{
        (this.usuarios = this.usuarios.filter(
          (u) => u.idUsuario !== idUsuario
        )),
      // Pequeño delay para asegurar que el backend procese la eliminación
        setTimeout(() => {
          this.cargar();
        }, 300);},
      error: (err) => console.error('Error al eliminar usuario', err),
    });
  }

  trackById = (_: number, item: Usuario) => item.idUsuario;

  /** Aplica todos los filtros activos */
  aplicarFiltros(): void {
    let resultado = [...this.usuarios];

    // Filtro por tipo de usuario
    if (this.filtroTipo && this.filtroTipo !== 'TODOS') {
      resultado = resultado.filter((u) => {
        const tipo = u?.tipo;
        return tipo && tipo.toUpperCase() === this.filtroTipo.toUpperCase();
      });
    }

    // Filtro por búsqueda (busca en email)
    if (this.filtroBusqueda && this.filtroBusqueda.trim().length > 0) {
      const busqueda = this.filtroBusqueda.toLowerCase().trim();
      resultado = resultado.filter((u) => {
        const email = (u?.email || '').toLowerCase();
        return email.includes(busqueda);
      });
    }

    this.usuariosFiltrados = resultado;
  }

  /** Limpia todos los filtros */
  limpiarFiltros(): void {
    this.filtroTipo = 'TODOS';
    this.filtroBusqueda = '';
    this.aplicarFiltros();
  }

  /** Cuenta cuántos usuarios hay por tipo */
  contarPorTipo(tipo: string): number {
    if (tipo === 'TODOS') return this.usuarios.length;

    return this.usuarios.filter((u) => {
      const tipoUsuario = u?.tipo;
      return tipoUsuario && tipoUsuario.toUpperCase() === tipo.toUpperCase();
    }).length;
  }
}
