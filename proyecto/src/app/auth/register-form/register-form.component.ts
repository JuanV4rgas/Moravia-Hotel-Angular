import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../model/usuario';
import { environment } from '../../../environments/environment';

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
  captchaToken: string | null = null;
  captchaError: string | null = null;
  siteKey = environment.recaptchaSiteKey;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{7,15}$')]],
      fotoPerfil: [''],
      clave: ['', [Validators.required, Validators.minLength(8)]],
      tipo: ['cliente', Validators.required] // 👈 nuevo campo agregado
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      if (!this.captchaToken) {
        this.captchaError = 'Por favor completa el captcha.';
        return;
      }
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.captchaError = null;

      const usuario: Usuario = this.registerForm.value;
      const captchaToken = this.captchaToken;

      this.authService.register(usuario, captchaToken).subscribe({
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
          this.resetCaptcha();
        }
      });
    } else {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
    }
  }

  cambiarALogin() {
    this.toggleForm.emit();
  }

  onCaptchaResolved(token: string | null) {
    this.captchaToken = token;
    this.captchaError = null;
  }

  private resetCaptcha() {
    this.captchaToken = null;
  }
}
