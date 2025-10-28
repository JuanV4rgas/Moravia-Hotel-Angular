import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-usuario-detail',
  templateUrl: './usuario-detail.component.html',
  styleUrls: ['./usuario-detail.component.css'],
})
export class UsuarioDetailComponent implements OnInit {
  usuario!: Usuario;
  idUsuario!: number;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.idUsuario = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.idUsuario)) {
      console.error('ID inválido');
      return;
    }

    this.usuarioService.getUsuarioById(this.idUsuario).subscribe({
      next: (data) => {
        this.usuario = data;
      },
      error: (err) => console.error('Error al cargar usuario', err),
    });
  }
}
