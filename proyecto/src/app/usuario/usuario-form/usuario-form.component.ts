import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm!: FormGroup;
  isEdit = false;
  loading = false;
  formChanged = false;
  mostrarClave = false;
  mostrarConfirmarClave = false;
  
  mensaje = '';
  error = '';
  
  usuario: Usuario = {
    idUsuario: 0,
    email: '',
    clave: '',
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    tipo: 'cliente',
    fotoPerfil: ''
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.loading = true;
      const id = Number(idParam);
      this.usuarioService.getUsuario(id).subscribe({
        next: (u) => {
          this.usuario = u;
          this.inicializarFormulario();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'No se pudo cargar el usuario.';
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.inicializarFormulario();
    }
  }

  inicializarFormulario(): void {
    this.usuarioForm = this.fb.group(
      {
        nombre: [this.usuario.nombre || '', [Validators.required, Validators.minLength(2)]],
        apellido: [this.usuario.apellido || '', [Validators.required, Validators.minLength(2)]],
        email: [this.usuario.email || '', [Validators.required, Validators.email]],
        cedula: [this.usuario.cedula || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        telefono: [this.usuario.telefono || '', [Validators.required, Validators.pattern('^[0-9]{7,15}$')]],
        fotoPerfil: [this.usuario.fotoPerfil || ''],
        tipo: [this.usuario.tipo || 'cliente', Validators.required],
        clave: ['', this.isEdit ? [Validators.minLength(8)] : [Validators.required, Validators.minLength(8)]],
        confirmarClave: ['', this.isEdit ? [Validators.minLength(8)] : [Validators.required, Validators.minLength(8)]],
      },
      { validators: this.passwordMatchValidator }
    );

    this.usuarioForm.valueChanges.subscribe(() => {
      this.formChanged = this.usuarioForm.dirty;
    });
  }

  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const clave = form.get('clave');
    const confirmarClave = form.get('confirmarClave');

    if (clave && confirmarClave && clave.value !== confirmarClave.value) {
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
    if (this.isEdit) {
      this.usuarioForm.reset({
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        email: this.usuario.email,
        cedula: this.usuario.cedula,
        telefono: this.usuario.telefono,
        fotoPerfil: this.usuario.fotoPerfil,
        tipo: this.usuario.tipo,
        clave: '',
        confirmarClave: '',
      });
    } else {
      this.usuarioForm.reset({
        nombre: '',
        apellido: '',
        email: '',
        cedula: '',
        telefono: '',
        fotoPerfil: '',
        tipo: 'cliente',
        clave: '',
        confirmarClave: '',
      });
    }
    this.formChanged = false;
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const formValue = this.usuarioForm.value;
      const updatedUsuario: Usuario = {
        ...this.usuario,
        nombre: formValue.nombre,
        apellido: formValue.apellido,
        email: formValue.email,
        cedula: formValue.cedula,
        telefono: formValue.telefono,
        fotoPerfil: formValue.fotoPerfil,
        tipo: formValue.tipo
      };

      if (formValue.clave && formValue.confirmarClave && formValue.clave === formValue.confirmarClave) {
        updatedUsuario.clave = formValue.clave;
      }

      this.loading = true;
      const req$ = this.isEdit
        ? this.usuarioService.updateUsuario(this.usuario.idUsuario, updatedUsuario)
        : this.usuarioService.addUsuario(updatedUsuario);

      req$.subscribe({
        next: () => {
          this.mensaje = this.isEdit ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/usuario/lista']);
          }, 1500);
        },
        error: (err) => {
          this.error = 'Error al guardar el usuario.';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/usuario/lista']);
  }

  togglePassword(tipo: 'clave' | 'confirmar'): void {
    if (tipo === 'clave') this.mostrarClave = !this.mostrarClave;
    else this.mostrarConfirmarClave = !this.mostrarConfirmarClave;
  }
}