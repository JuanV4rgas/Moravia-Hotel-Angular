import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  year = new Date().getFullYear();

  // Modelo para el formulario de newsletter
  newsletterData = {
    email: '',
  };

  constructor() {}

  onNewsletterSubmit(): void {
    if (this.newsletterData.email) {
      // Aquí iría la lógica para suscribir al newsletter
      console.log('Suscribiéndose con email:', this.newsletterData.email);

      // Mostrar mensaje de éxito o manejar respuesta
      alert('¡Gracias por suscribirte a nuestro newsletter!');

      // Limpiar formulario
      this.newsletterData.email = '';
    }
  }
}
