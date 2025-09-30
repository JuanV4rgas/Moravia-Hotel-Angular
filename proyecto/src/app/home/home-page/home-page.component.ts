import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';

// Interfaces para los datos
interface Habitacion {
  id: string;
  nombre: string;
  precio: number;
  foto: string;
  descripcion?: string;
  capacidad?: string;
  numeroCamas?: number;
  tipo?: string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit, AfterViewInit {
  year = new Date().getFullYear();
  habitaciones: Habitacion[] = [];



  ngOnInit() {

  }

  ngAfterViewInit(): void {

  }

}

// Datos mock de habitaciones
const MOCK_HABITACIONES: Habitacion[] = [
  {
    id: 'HAB001',
    nombre: 'Suite Presidencial Castillo',
    precio: 1850,
    foto: 'https://giessbach.ch/images/image_uploads/GrandhotelGiessbach_%C2%A9DigitaleMassarbeit_269.jpg',
    descripcion:
      'Suite de lujo con vistas panorámicas al Castillo de Praga, jacuzzi privado, sala de estar amplia y servicio de mayordomo personal.',
    capacidad: '2 adultos + 1 niño',
    numeroCamas: 1,
    tipo: 'Suite',
  },
  {
    id: 'HAB002',
    nombre: 'Suite Real Bohemia',
    precio: 1350,
    foto: 'https://giessbach.ch/images/image_uploads/224_Weber-Suite-Wohnzimmer.jpg',
    descripcion:
      'Habitación espaciosa decorada con estilo clásico bohemio, chimenea de mármol y terraza privada con vistas al río Moldava.',
    capacidad: '2 adultos',
    numeroCamas: 1,
    tipo: 'Suite',
  },
  {
    id: 'HAB003',
    nombre: 'Junior Suite Imperial',
    precio: 890,
    foto: 'https://giessbach.ch/images/image_uploads/Suite-Horace-Edouard-Zimmer.jpg',
    descripcion:
      'Suite elegante con sala de estar separada, baño de mármol con bañera profunda y decoración contemporánea de lujo.',
    capacidad: '2 adultos + 1 niño',
    numeroCamas: 1,
    tipo: 'Suite',
  },
  {
    id: 'HAB004',
    nombre: 'Habitación Deluxe Panorámica',
    precio: 520,
    foto: 'https://giessbach.ch/images/image_uploads/_zimmer/Suite-von-Rappard-Wohnecke.jpg',
    descripcion:
      'Habitación moderna con ventanales de piso a techo, vistas al casco histórico de Praga y cama king-size premium.',
    capacidad: '2 adultos',
    numeroCamas: 1,
    tipo: 'Doble',
  },
  {
    id: 'HAB005',
    nombre: 'Habitación Superior Doble',
    precio: 340,
    foto: 'https://giessbach.ch/images/image_uploads/_zimmer/307_DDGB-Zimmer.jpg',
    descripcion:
      'Habitación refinada con dos camas individuales, escritorio de trabajo y baño privado con ducha efecto lluvia.',
    capacidad: '2 adultos',
    numeroCamas: 2,
    tipo: 'Doble',
  },
  {
    id: 'HAB006',
    nombre: 'Habitación Familiar Premium',
    precio: 610,
    foto: 'https://giessbach.ch/images/image_uploads/306_CDGB.jpg',
    descripcion:
      'Amplia habitación diseñada para familias, equipada con cama king-size, sofá cama, área de juegos para niños y balcón privado.',
    capacidad: '2 adultos + 2 niños',
    numeroCamas: 2,
    tipo: 'Doble',
  },
  {
    id: 'HAB007',
    nombre: 'Habitación Individual Deluxe',
    precio: 270,
    foto: 'https://www.hola.com/horizon/original_aspect_ratio/f43d5e2f613c-habitaciones-hotel-8a-a.jpg',
    descripcion:
      'Habitación individual de lujo con cama queen-size, escritorio de trabajo ergonómico y baño privado con acabados en mármol.',
    capacidad: '1 adulto',
    numeroCamas: 1,
    tipo: 'Sencilla',
  },
  {
    id: 'HAB008',
    nombre: 'Habitación Individual Estándar',
    precio: 150,
    foto: 'https://giessbach.ch/images/image_uploads/230_GLWA_neu.jpg',
    descripcion:
      'Habitación sencilla y acogedora equipada con cama individual, escritorio y baño privado. Ideal para estancias cortas.',
    capacidad: '1 adulto',
    numeroCamas: 1,
    tipo: 'Sencilla',
  },
];
