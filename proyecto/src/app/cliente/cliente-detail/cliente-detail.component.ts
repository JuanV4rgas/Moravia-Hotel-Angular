import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-cliente-detail',
  templateUrl: './cliente-detail.component.html',
  styleUrls: ['./cliente-detail.component.css']
})
export class ClienteDetailComponent implements OnInit {
  cliente!: Usuario;
  reservas: any[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.error = 'ID inválido';
      this.loading = false;
      return;
    }

    // Cargar cliente con reservas
    this.usuarioService.getUsuarioConReservas(id).subscribe({
      next: (data) => {
        this.cliente = data;
        this.reservas = data.reservas || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar el cliente.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/cliente/table']);
  }
}