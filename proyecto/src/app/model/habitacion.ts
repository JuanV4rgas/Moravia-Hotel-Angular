import { TipoHabitacion } from "./tipo-habitacion";

export interface Habitacion {
  id: number;               // Long -> number
  numeroHabitacion: string;
  disponible: boolean;
  tipo: TipoHabitacion;         // Relación ManyToOne con Habitacion
}
