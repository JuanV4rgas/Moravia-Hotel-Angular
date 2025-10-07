import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../model/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-table',
  templateUrl: './cliente-table.component.html',
  styleUrls: ['./cliente-table.component.css']
})
export class ClienteTableComponent implements OnInit {

  clientes: Cliente[] = [];
  selectedCliente!: Cliente;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.clienteService.getAll().subscribe({
      next: (data) => this.clientes = data,
      error: (err) => console.error('Error cargando clientes', err)
    });
  }

  mostrarCliente(cliente: Cliente) {
    this.selectedCliente = cliente;
  }

  eliminarCliente(id: number) {
    this.clienteService.delete(id).subscribe({
      next: () => {
        this.clientes = this.clientes.filter(c => c.idUsuario !== id);
      },
      error: (err) => console.error('Error eliminando cliente', err)
    });
  }
}
