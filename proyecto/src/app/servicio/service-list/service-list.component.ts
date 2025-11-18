import { Component, OnInit } from '@angular/core';
import { Servicio } from '../../model/servicio';
import { ServicioService } from '../../services/servicio.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  servicios: Servicio[] = [];
  loading = true;

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

  onImageError(event: any) {
    event.target.src = 'assets/img/portrait-grandhotel-giessbach-br.webp';
  }
}
