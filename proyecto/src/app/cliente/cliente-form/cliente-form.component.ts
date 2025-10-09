import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../model/cliente';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html'
})
export class ClienteFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  error?: string;

  cliente: Cliente = {
    idUsuario: 0,
    email: '',
    clave: '',
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    fotoPerfil: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.loading = true;
      const id = Number(idParam);
      this.clienteService.getCliente(id).subscribe({
        next: (c) => { this.cliente = c; this.loading = false; },
        error: (err) => { this.error = 'No se pudo cargar el cliente.'; console.error(err); this.loading = false; }
      });
    }
  }

  guardar(): void {
    if (!this.cliente.nombre?.trim() || !this.cliente.apellido?.trim() ||
        !this.cliente.email?.trim() || (!this.isEdit && !this.cliente.clave?.trim())) {
      this.error = 'Nombre, apellido, email y clave (al crear) son obligatorios.';
      return;
    }
    this.loading = true;
    const req$ = this.isEdit
      ? this.clienteService.updateCliente(this.cliente.idUsuario, this.cliente)
      : this.clienteService.addCliente(this.cliente);

    req$.subscribe({
      next: () => { this.loading = false; this.router.navigate(['/cliente/lista']); },
      error: (err) => { this.error = 'No se pudo guardar el cliente.'; console.error(err); this.loading = false; }
    });
  }

  cancelar(): void { this.router.navigate(['/cliente/lista']); }

  onClear(): void {
    this.cliente = {
      idUsuario: 0, email: '', clave: '',
      nombre: '', apellido: '', cedula: '', telefono: '', fotoPerfil: ''
    };
  }
}
