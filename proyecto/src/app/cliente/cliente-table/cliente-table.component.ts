import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from '../../model/cliente';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-table',
  templateUrl: './cliente-table.component.html'
})
export class ClienteTableComponent implements OnInit {
  clientes: Cliente[] = [];
  loading = true;
  error?: string;

  constructor(private clienteService: ClienteService, private router: Router) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.loading = true;
    this.clienteService.getAllClientes().subscribe({
      next: (data) => { this.clientes = data; this.loading = false; },
      error: (err) => { this.error = 'No se pudieron cargar los clientes.'; console.error(err); this.loading = false; }
    });
  }

  eliminar(idUsuario: number): void {
    if (!confirm('¿Eliminar este cliente?')) return;
    this.clienteService.deleteCliente(idUsuario).subscribe({
      next: () => this.clientes = this.clientes.filter(c => c.idUsuario !== idUsuario),
      error: (err) => console.error('Error al eliminar cliente', err)
    });
  }

  trackById = (_: number, item: Cliente) => item.idUsuario;
}
