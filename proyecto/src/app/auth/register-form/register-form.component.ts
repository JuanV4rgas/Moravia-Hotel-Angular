import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {
  @Output() toggleForm = new EventEmitter<void>();

  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{7,15}$')]],
      fotoPerfil: [''],
      clave: ['', Validators.required],
      tipo: ['cliente', Validators.required] // 👈 nuevo campo agregado
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const usuario: Usuario = this.registerForm.value;

      this.authService.register(usuario).subscribe({
        next: () => {
          console.log('Registro exitoso');
          this.isLoading = false;
          this.successMessage = '¡Registro exitoso! Redirigiendo al login...';
          setTimeout(() => {
            this.toggleForm.emit();
          }, 2000);
        },
        error: (error) => {
          console.error('Error en registro:', error);
          this.errorMessage = error.message || 'Error al registrar usuario';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
    }
  }

  cambiarALogin() {
    this.toggleForm.emit();
  }
}
