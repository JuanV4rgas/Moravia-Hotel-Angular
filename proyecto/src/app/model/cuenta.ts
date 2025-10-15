import { Servicio } from './servicio';

export interface Cuenta {
  id?: number;
  estado?: string;
  total?: number;
  reserva?: any; // Referencia a la reserva
  servicios?: Servicio[];
}