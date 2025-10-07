import { Reserva } from './reserva';
import { Servicio } from './servicio';

export interface Cuenta {
  id: number;
  estado: string;
  total: number;
  reserva: Reserva;
  servicios: Servicio[];
}
  