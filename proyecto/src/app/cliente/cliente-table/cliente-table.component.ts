import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-cliente-table',
  templateUrl: './cliente-table.component.html',
  styleUrls: ['./cliente-table.component.css']
})
export class ClienteTableComponent implements OnInit {
  clientes: Usuario[] = [];
  loading = true;
  error?: string;

  constructor(private clienteService: UsuarioService, private router: Router) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.loading = true;
    this.clienteService.getClientes().subscribe({
      next: (data) => { this.clientes = data; this.loading = false; },
      error: (err) => { this.error = 'No se pudieron cargar los clientes.'; console.error(err); this.loading = false; }
    });
  }

  eliminar(idUsuario: number): void {
    if (!confirm('¿Eliminar este cliente?')) return;
    this.clienteService.deleteUsuario(idUsuario).subscribe({
      next: () => this.clientes = this.clientes.filter(c => c.idUsuario !== idUsuario),
      error: (err) => console.error('Error al eliminar cliente', err)
    });
  }

  trackById = (_: number, item: Usuario) => item.idUsuario;
}
