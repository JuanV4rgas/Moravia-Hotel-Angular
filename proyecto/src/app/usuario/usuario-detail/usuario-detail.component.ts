import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-usuario-detail',
  templateUrl: './usuario-detail.component.html',
  styleUrls: ['./usuario-detail.component.css'],
})
export class UsuarioDetailComponent implements OnInit {
  usuario!: Usuario;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    const idUsuario = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(idUsuario)) {
      this.error = 'ID inválido';
      this.loading = false;
      return;
    }

    this.usuarioService.getUsuarioById(idUsuario).subscribe({
      next: (data) => {
        this.usuario = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar usuario';
        console.error(err);
        this.loading = false;
      },
    });
  }

  volver(): void {
    this.router.navigate(['/usuario/lista']);
  }

  getTipoBadgeClass(): string {
    switch (this.usuario.tipo) {
      case 'administrador':
        return 'bg-danger';
      case 'operador':
        return 'bg-warning text-dark';
      case 'cliente':
      default:
        return 'bg-info';
    }
  }
}