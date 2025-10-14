import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css'],
})
export class ProfileFormComponent implements OnInit {
  @Input() usuario!: Usuario;
  perfilForm!: FormGroup;
  formChanged = false;
  mostrarNuevaClave = false;
  mostrarConfirmarClave = false;
  datosActualizados: any = {};

  @Output() formChangedChange = new EventEmitter<boolean>();
  @Output() mensajeChange = new EventEmitter<string>();
  @Output() errorChange = new EventEmitter<string>();

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.perfilForm = this.fb.group(
      {
        nombre: [this.usuario.nombre],
        apellido: [this.usuario.apellido],
        email: [this.usuario.email],
        cedula: [this.usuario.cedula],
        telefono: [this.usuario.telefono],
        fotoPerfil: [this.usuario.fotoPerfil],
        tipo: [this.usuario.tipo],
        nuevaClave: ['', [Validators.minLength(8)]],
        confirmarClave: ['', [Validators.minLength(8)]],
      },
      { validators: this.passwordMatchValidator }
    );

    this.perfilForm.valueChanges.subscribe(() => {
      const nuevaClave = this.perfilForm.get('nuevaClave')?.value;
      const confirmarClave = this.perfilForm.get('confirmarClave')?.value;

      // Only consider form changed if password fields are both filled and match, or other fields are dirty
      const otherFieldsDirty = [
        'nombre',
        'apellido',
        'email',
        'cedula',
        'telefono',
        'fotoPerfil',
        'tipo',
      ].some((field) => this.perfilForm.get(field)?.dirty);

      const passwordsValid =
        nuevaClave &&
        confirmarClave &&
        nuevaClave === confirmarClave &&
        nuevaClave.length >= 8;

      this.formChanged = otherFieldsDirty || passwordsValid;
      this.formChangedChange.emit(this.formChanged);

      Object.keys(this.perfilForm.value).forEach((key) => {
        if (this.perfilForm.get(key)?.dirty) {
          this.datosActualizados[key] = this.perfilForm.value[key];
        }
      });
    });
  }

  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const nuevaClave = form.get('nuevaClave');
    const confirmarClave = form.get('confirmarClave');

    if (
      nuevaClave &&
      confirmarClave &&
      nuevaClave.value !== confirmarClave.value
    ) {
      confirmarClave.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    if (confirmarClave?.hasError('mismatch')) {
      const errors = { ...confirmarClave.errors };
      delete errors['mismatch'];
      confirmarClave.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  }

  resetForm(): void {
    this.perfilForm.reset({
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      email: this.usuario.email,
      cedula: this.usuario.cedula,
      tipo: this.usuario.tipo,
      telefono: this.usuario.telefono,
      fotoPerfil: this.usuario.fotoPerfil,
      nuevaClave: '',
      confirmarClave: '',
    });
    this.formChanged = false;
    this.formChangedChange.emit(this.formChanged);
  }

  onSubmit(): void {
    if (this.perfilForm.valid) {
      const formValue = this.perfilForm.value;
      const updatedUsuario: Usuario = {
        ...this.usuario,
        ...this.datosActualizados,
      };

      if (
        formValue.nuevaClave &&
        formValue.confirmarClave &&
        formValue.nuevaClave === formValue.confirmarClave
      ) {
        updatedUsuario.clave = formValue.nuevaClave;
      }

      this.usuarioService
        .updateUsuario(this.usuario.idUsuario!, updatedUsuario)
        .subscribe({
          next: () => {
            this.mensajeChange.emit('Cambios guardados correctamente.');
            this.formChanged = false;
            this.formChangedChange.emit(this.formChanged);
          },
          error: () => this.errorChange.emit('Error al guardar los cambios.'),
        });

      this.authService.updateCurrentUser(updatedUsuario).subscribe({
        next: () => console.log('Usuario actual en AuthService actualizado'),
        error: () =>
          console.error('Error al actualizar usuario en AuthService'),
      });
    }
  }

  eliminarUsuario(): void {
    if (confirm('¿Seguro que deseas eliminar tu cuenta?')) {
      this.usuarioService.deleteUsuario(this.usuario.idUsuario!).subscribe({
        next: () => {
          this.mensajeChange.emit('Cuenta eliminada correctamente.');
          this.authService.logout();
          this.router.navigate(['/']);
        },
        error: () => this.errorChange.emit('No se pudo eliminar la cuenta.'),
      });
    }
  }

  togglePassword(tipo: 'nueva' | 'confirmar'): void {
    if (tipo === 'nueva') this.mostrarNuevaClave = !this.mostrarNuevaClave;
    else this.mostrarConfirmarClave = !this.mostrarConfirmarClave;
  }
}
