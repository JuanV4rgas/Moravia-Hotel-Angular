import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

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
  captchaToken: string | null = null;
  captchaError: string | null = null;
  siteKey = environment.recaptchaSiteKey;

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
      if (!this.captchaToken) {
        this.captchaError = 'Por favor completa el captcha.';
        return;
      }
      this.isLoading = true;
      this.errorMessage = '';
      this.captchaError = null;

      const { email, clave } = this.loginForm.value;
      const captchaToken = this.captchaToken;

      this.authService.login(email, clave, captchaToken).subscribe({
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
          this.resetCaptcha();
        }
      });
    } else {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
    }
  }

  cambiarARegistro() {
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
