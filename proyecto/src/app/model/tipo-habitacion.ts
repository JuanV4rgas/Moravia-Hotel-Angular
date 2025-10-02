import { Habitacion } from './habitacion';

export interface TipoHabitacion {
  idHabitacion: number;   
  nombre: string;
  tipo: string;
  descripcion: string;
  precio: number;         
  capacidad: string;
  numeroCamas: number;    
  imagenUrl: string;
  habitaciones: Habitacion[];   // relación OneToMany
}