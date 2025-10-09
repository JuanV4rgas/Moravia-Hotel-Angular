import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service';

/**
 * Guard funcional moderno para proteger rutas
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated) {
    return true;
  }

  // Si no está autenticado, redirigir al login
  console.log('No autenticado, redirigiendo a /auth');
  router.navigate(['/auth'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

/**
 * Guard para verificar roles específicos
 * Ejemplo de uso: canActivate: [roleGuard('admin')]
 *
export const roleGuard = (requiredRole: string): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated) {
      router.navigate(['/auth']);
      return false;
    }


    if (authService.hasRole(requiredRole)) {
      return true;
    }

    // Si no tiene el rol, redirigir a home o página de acceso denegado
    router.navigate(['/home'], {
      queryParams: { error: 'access_denied' }
    });
    return false;
  };
};
  */