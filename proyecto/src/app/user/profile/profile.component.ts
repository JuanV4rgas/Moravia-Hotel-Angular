import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  usuario!: Usuario;
  perfilForm!: FormGroup;
  formChanged = false;
  mostrarNuevaClave = false;
  mostrarConfirmarClave = false;

  mensaje = '';
  error = '';

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService,private authService: AuthService,
      private router: Router) {}
ngOnInit(): void {
    // Suscribirse al usuario actual
    this.authService.usuario$.subscribe(
      usuario => this.usuario = usuario!
    );

    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre],
      apellido: [this.usuario.apellido],
      email: [this.usuario.email],
      cedula: [this.usuario.cedula],
      telefono: [this.usuario.telefono],
      fotoPerfil: [this.usuario.fotoPerfil],
      nuevaClave: [''],
      confirmarClave: ['']
    });

    this.perfilForm.valueChanges.subscribe(() => {
      this.formChanged = this.perfilForm.dirty;
    });
  }

  togglePassword(tipo: 'nueva' | 'confirmar'): void {
    if (tipo === 'nueva') this.mostrarNuevaClave = !this.mostrarNuevaClave;
    else this.mostrarConfirmarClave = !this.mostrarConfirmarClave;
  }

  resetForm(): void {
    this.perfilForm.reset({
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      email: this.usuario.email,
      cedula: this.usuario.cedula,
      telefono: this.usuario.telefono,
      fotoPerfil: this.usuario.fotoPerfil,
      nuevaClave: '',
      confirmarClave: ''
    });
    this.formChanged = false;
  }

  onSubmit(): void {
    if (this.perfilForm.valid) {
      this.usuarioService.updateUsuario(this.usuario.idUsuario!, this.perfilForm.value).subscribe({
        next: () => {
          this.mensaje = 'Cambios guardados correctamente.';
          this.formChanged = false;
        },
        error: () => (this.error = 'Error al guardar los cambios.')
      });
    }
  }

  eliminarUsuario(): void {
    if (confirm('¿Seguro que deseas eliminar tu cuenta?')) {
      this.usuarioService.deleteUsuario(this.usuario.idUsuario!).subscribe({
        next: () => (this.mensaje = 'Cuenta eliminada correctamente.'),
        error: () => (this.error = 'No se pudo eliminar la cuenta.')
      });
    }
  }
}
