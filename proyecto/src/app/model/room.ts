import { Habitacion } from 'src/app/habitacion/habitacion';

export interface Room {
  id: number;               // Long -> number
  numeroHabitacion: string;
  disponible: boolean;
  tipo: Habitacion;         // Relación ManyToOne con Habitacion
}
