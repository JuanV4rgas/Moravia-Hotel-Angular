import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html'
})
export class UsuarioFormComponent implements OnInit {
  @Output() saved = new EventEmitter<void>();

  // Importante: idUsuario:number, email, clave, nombre, apellido, cedula, telefono, fotoPerfil?
  usuario: Usuario = {
    idUsuario: 0,
    email: '',
    clave: '',
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    fotoPerfil: ''
  };

  loading = false;
  isEdit = false;
  error?: string;

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.loading = true;
      const id = Number(idParam);
      this.usuarioService.getUsuario(id).subscribe({
        next: (u) => { this.usuario = u; this.loading = false; },
        error: (err) => { this.error = 'No se pudo cargar el usuario.'; console.error(err); this.loading = false; }
      });
    }
  }

  addUsuarioForm(): void {
    if (!this.usuario.nombre?.trim() || !this.usuario.apellido?.trim() || !this.usuario.email?.trim()) {
      this.error = 'Nombre, apellido y email son obligatorios.'; return;
    }
    if (!this.isEdit && !this.usuario.clave?.trim()) {
      this.error = 'La clave es obligatoria al crear.'; return;
    }

    this.loading = true;

    const req$ = this.isEdit
      ? this.usuarioService.updateUsuario(this.usuario.idUsuario, this.usuario)
      : this.usuarioService.addUsuario(this.usuario);

    req$.subscribe({
      next: () => {
        this.loading = false;
        this.saved.emit();
        // this.router.navigate(['/usuario/table']); // opcional
        if (!this.isEdit) this.onClear();
      },
      error: (err) => { this.error = 'No se pudo guardar el usuario.'; console.error(err); this.loading = false; }
    });
  }

  onClear(): void {
    this.usuario = {
      idUsuario: this.isEdit ? this.usuario.idUsuario : 0,
      email: '',
      clave: '',
      nombre: '',
      apellido: '',
      cedula: '',
      telefono: '',
      fotoPerfil: ''
    };
    this.error = undefined;
  }
}
