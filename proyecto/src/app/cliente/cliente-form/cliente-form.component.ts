import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {
  clienteForm!: FormGroup;
  isEdit = false;
  loading = false;
  formChanged = false;
  mostrarClave = false;
  mostrarConfirmarClave = false;
  
  mensaje = '';
  error = '';
  
  cliente: Usuario = {
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
        next: (c) => {
          this.cliente = c;
          this.inicializarFormulario();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'No se pudo cargar el cliente.';
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.inicializarFormulario();
    }
  }

  inicializarFormulario(): void {
    this.clienteForm = this.fb.group(
      {
        nombre: [this.cliente.nombre || '', [Validators.required, Validators.minLength(2)]],
        apellido: [this.cliente.apellido || '', [Validators.required, Validators.minLength(2)]],
        email: [this.cliente.email || '', [Validators.required, Validators.email]],
        cedula: [this.cliente.cedula || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        telefono: [this.cliente.telefono || '', [Validators.required, Validators.pattern('^[0-9]{7,15}$')]],
        fotoPerfil: [this.cliente.fotoPerfil || ''],
        clave: ['', this.isEdit ? [Validators.minLength(8)] : [Validators.required, Validators.minLength(8)]],
        confirmarClave: ['', this.isEdit ? [Validators.minLength(8)] : [Validators.required, Validators.minLength(8)]],
      },
      { validators: this.passwordMatchValidator }
    );

    this.clienteForm.valueChanges.subscribe(() => {
      this.formChanged = this.clienteForm.dirty;
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
      this.clienteForm.reset({
        nombre: this.cliente.nombre,
        apellido: this.cliente.apellido,
        email: this.cliente.email,
        cedula: this.cliente.cedula,
        telefono: this.cliente.telefono,
        fotoPerfil: this.cliente.fotoPerfil,
        clave: '',
        confirmarClave: '',
      });
    } else {
      this.clienteForm.reset({
        nombre: '',
        apellido: '',
        email: '',
        cedula: '',
        telefono: '',
        fotoPerfil: '',
        clave: '',
        confirmarClave: '',
      });
    }
    this.formChanged = false;
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      const formValue = this.clienteForm.value;
      const updatedCliente: Usuario = {
        ...this.cliente,
        nombre: formValue.nombre,
        apellido: formValue.apellido,
        email: formValue.email,
        cedula: formValue.cedula,
        telefono: formValue.telefono,
        fotoPerfil: formValue.fotoPerfil,
        tipo: 'cliente'
      };

      if (formValue.clave && formValue.confirmarClave && formValue.clave === formValue.confirmarClave) {
        updatedCliente.clave = formValue.clave;
      }

      this.loading = true;
      const req$ = this.isEdit
        ? this.usuarioService.updateUsuario(this.cliente.idUsuario, updatedCliente)
        : this.usuarioService.addUsuario(updatedCliente);

      req$.subscribe({
        next: () => {
          this.mensaje = this.isEdit ? 'Cliente actualizado correctamente.' : 'Cliente creado correctamente.';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/cliente/lista']);
          }, 1500);
        },
        error: (err) => {
          this.error = 'Error al guardar el cliente.';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/cliente/lista']);
  }

  togglePassword(tipo: 'clave' | 'confirmar'): void {
    if (tipo === 'clave') this.mostrarClave = !this.mostrarClave;
    else this.mostrarConfirmarClave = !this.mostrarConfirmarClave;
  }
}