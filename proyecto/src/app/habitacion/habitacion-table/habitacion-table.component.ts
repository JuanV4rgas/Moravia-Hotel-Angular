import { Component } from '@angular/core';
import { Habitacion } from '../habitacion';

@Component({
  selector: 'app-habitacion-table',
  templateUrl: './habitacion-table.component.html',
  styleUrls: ['./habitacion-table.component.css']
})
export class HabitacionTableComponent {


  //Atributos
  selectedHabitacion!: Habitacion;

  //Base de datos
    HabitacionesList: Habitacion[] = [
       {
      "id": "HAB001",
      "name": "Suite Presidencial Castillo",
      "description": "Suite de lujo con vistas panorámicas al Castillo de Praga, jacuzzi privado, sala de estar amplia y servicio de mayordomo personal.",
      "price": 1850,
      "capacity": "2 adultos + 1 niño",
      "numberOfBeds": 1,
      "image": "https://giessbach.ch/images/image_uploads/GrandhotelGiessbach_%C2%A9DigitaleMassarbeit_269.jpg",
      "type": "Suite"
    },
    {
      "id": "HAB002",
      "name": "Suite Real Bohemia",
      "description": "Habitación espaciosa decorada con estilo clásico bohemio, chimenea de mármol y terraza privada con vistas al río Moldava.",
      "price": 1350,
      "capacity": "2 adultos",
      "numberOfBeds": 1,
      "image": "https://giessbach.ch/images/image_uploads/224_Weber-Suite-Wohnzimmer.jpg",
      "type": "Suite"
    },
    {
      "id": "HAB003",
      "name": "Junior Suite Imperial",
      "description": "Suite elegante con sala de estar separada, baño de mármol con bañera profunda y decoración contemporánea de lujo.",
      "price": 890,
      "capacity": "2 adultos + 1 niño",
      "numberOfBeds": 1,
      "image": "https://giessbach.ch/images/image_uploads/Suite-Horace-Edouard-Zimmer.jpg",
      "type": "Suite"
    },
    {
      "id": "HAB004",
      "name": "Habitación Deluxe Panorámica",
      "description": "Habitación moderna con ventanales de piso a techo, vistas al casco histórico de Praga y cama king-size premium.",
      "price": 520,
      "capacity": "2 adultos",
      "numberOfBeds": 1,
      "image": "https://giessbach.ch/images/image_uploads/_zimmer/Suite-von-Rappard-Wohnecke.jpg",
      "type": "Doble"
    },
    {
      "id": "HAB005",
      "name": "Habitación Superior Doble",
      "description": "Habitación refinada con dos camas individuales, escritorio de trabajo y baño privado con ducha efecto lluvia.",
      "price": 340,
      "capacity": "2 adultos",
      "numberOfBeds": 2,
      "image": "https://giessbach.ch/images/image_uploads/_zimmer/307_DDGB-Zimmer.jpg",
      "type": "Doble"
    },
    {
      "id": "HAB006",
      "name": "Habitación Familiar Premium",
      "description": "Amplia habitación diseñada para familias, equipada con cama king-size, sofá cama, área de juegos para niños y balcón privado.",
      "price": 610,
      "capacity": "2 adultos + 2 niños",
      "numberOfBeds": 2,
      "image": "https://giessbach.ch/images/image_uploads/306_CDGB.jpg",
      "type": "Doble"
    },
    {
      "id": "HAB007",
      "name": "Habitación Individual Deluxe",
      "description": "Habitación individual de lujo con cama queen-size, escritorio de trabajo ergonómico y baño privado con acabados en mármol.",
      "price": 270,
      "capacity": "1 adulto",
      "numberOfBeds": 1,
      "image": "https://www.hola.com/horizon/original_aspect_ratio/f43d5e2f613c-habitaciones-hotel-8a-a.jpg",
      "type": "Sencilla"
    },
    {
      "id": "HAB008",
      "name": "Habitación Individual Estándar",
      "description": "Habitación sencilla y acogedora equipada con cama individual, escritorio y baño privado. Ideal para estancias cortas.",
      "price": 150,
      "capacity": "1 adulto",
      "numberOfBeds": 1,
      "image": "https://giessbach.ch/images/image_uploads/230_GLWA_neu.jpg",
      "type": "Sencilla"
    }
    ];

      mostrarHabitacion(habitacion:Habitacion){
        this.selectedHabitacion= habitacion;
      }
    
      agregarHabitacion(habitacion:Habitacion){
        this.HabitacionesList.push(habitacion);
      }
    
      eliminarHabitacion(habitacion:Habitacion){
        var index = this.HabitacionesList.indexOf(habitacion);
        this.HabitacionesList.splice(index,1);
      }
}
