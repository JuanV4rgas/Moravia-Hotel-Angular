import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  public theme$: Observable<Theme> = this.themeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  /**
   * Obtiene el tema inicial del localStorage o sistema
   */
  private getInitialTheme(): Theme {
    const stored = localStorage.getItem('app-theme') as Theme;
    if (stored) {
      return stored;
    }
    return 'light';
  }

  /**
   * Inicializa el tema al cargar la app
   */
  private initializeTheme(): void {
    const theme = this.themeSubject.value;
    this.applyTheme(theme);
  }

  /**
   * Cambia el tema actual
   */
  public toggleTheme(): void {
    const currentTheme = this.themeSubject.value;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Establece un tema específico
   */
  public setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    localStorage.setItem('app-theme', theme);
  }

  /**
   * Obtiene el tema actual
   */
  public getTheme(): Theme {
    return this.themeSubject.value;
  }

  /**
   * Aplica el tema al documento
   */
  private applyTheme(theme: Theme): void {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
  }
}
