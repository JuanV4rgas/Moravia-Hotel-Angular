import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

  map: {
    description: string;
    embedUrl: SafeResourceUrl;
    link: string;
    linkLabel: string;
  };

  constructor(private sanitizer: DomSanitizer) {
    this.map = {
      description:
        'A pasos del Puente de Carlos, en pleno distrito de Mala Strana.',
      embedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2562.1646264274494!2d14.408041812072536!3d50.08866837131186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b95312c1d73b1%3A0xd4f8691b093c9e7f!2sU%20Lu%C5%BEick%C3%A9ho%20semin%C3%A1%C5%99e%2C%20118%2000%20Praha%201-Mal%C3%A1%20Strana!5e0!3m2!1ses!2sco!4v1731528350076!5m2!1ses!2sco'
      ),
      link: 'https://maps.app.goo.gl/8STCfvWWx1rK3ANN9',
      linkLabel: 'Ver ruta en Google Maps',
    };
  }

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
