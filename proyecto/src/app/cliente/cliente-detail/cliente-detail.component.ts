import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-cliente-detail',
  templateUrl: './cliente-detail.component.html'
})
export class ClienteDetailComponent implements OnInit {
  cliente?: Usuario;
  loading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: UsuarioService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.clienteService.getUsuario(id).subscribe({
      next: (c) => { this.cliente = c; this.loading = false; },
      error: (err) => { this.error = 'No se pudo cargar el cliente.'; console.error(err); this.loading = false; }
    });
  }

  volver(): void { this.router.navigate(['/cliente/lista']); }
}
