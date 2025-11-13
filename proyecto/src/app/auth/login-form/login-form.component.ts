import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  @Output() toggleForm = new EventEmitter<void>();

  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      clave: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, clave } = this.loginForm.value;

      this.authService.login(email, clave).subscribe({
        next: (usuario) => {
          console.log('Login exitoso:', usuario);
          this.isLoading = false;
          // Redirigir a la página principal
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error en login:', error);
          // Prefer server-provided message when available (body may contain timestamp, status, message)
          this.errorMessage = (error && error.error && (error.error.message || error.error)) || error.message || 'Error al iniciar sesión';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
    }
  }

  cambiarARegistro() {
    this.toggleForm.emit();
  }
}