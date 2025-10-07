import { Room } from './room';
import { Cliente } from './cliente';
import { Cuenta } from './cuenta';

export interface Reserva {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  cliente: Cliente;
  cuenta: Cuenta;
  rooms: Room[];
}
