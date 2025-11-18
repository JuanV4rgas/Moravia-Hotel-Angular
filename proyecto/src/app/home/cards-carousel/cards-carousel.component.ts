import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Servicio } from '../../model/servicio';
import { ServicioService } from '../../services/servicio.service';

@Component({
  selector: 'app-cards-carousel',
  templateUrl: './cards-carousel.component.html',
  styleUrls: ['./cards-carousel.component.css'],
})
export class CardsCarouselComponent implements OnInit {
  servicios: Servicio[] = [];
  loading = true;

  currentIndex = 0;

  constructor(private servicioService: ServicioService) {}

  ngOnInit() {
    this.servicioService.getAllServicios().subscribe({
      next: (data) => {
        this.servicios = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading services:', err);
        this.loading = false;
      }
    });
  }

  @ViewChild('track', { static: true }) track!: ElementRef<HTMLDivElement>;

  private readonly scrollAmount = 190 + 16; // ancho tarjeta + gap

  scrollPrev() {
    this.track.nativeElement.scrollBy({
      left: -this.scrollAmount,
      behavior: 'smooth',
    });
  }

  scrollNext() {
    this.track.nativeElement.scrollBy({
      left: this.scrollAmount,
      behavior: 'smooth',
    });
  }

  onImageError(event: any) {
    event.target.src = 'assets/img/portrait-grandhotel-giessbach-br.webp';
  }
}
