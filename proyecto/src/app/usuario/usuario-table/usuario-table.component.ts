import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-usuario-table',
  standalone: true,
  templateUrl: './usuario-table.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./usuario-table.component.css'],
})
export class UsuarioTableComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = true;
  error?: string;

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.usuarioService.getAllUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los clientes.';
        console.error(err);
        this.loading = false;
      },
    });
  }

  eliminar(idUsuario: number): void {
    if (!confirm('¿Eliminar este cliente?')) return;
    this.usuarioService.deleteUsuario(idUsuario).subscribe({
      next: () =>
        (this.usuarios = this.usuarios.filter(
          (user) => user.idUsuario !== idUsuario
        )),
      error: (err) => console.error('Error al eliminar cliente', err),
    });
  }

  trackById = (_: number, item: Usuario) => item.idUsuario;
}
