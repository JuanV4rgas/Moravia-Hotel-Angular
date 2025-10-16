// Importar Room desde el modelo unificado
import { Room } from './room';
import { Servicio } from './servicio';

export interface Reserva {
  id?: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  cliente: {
    idUsuario: number;
    nombre: string;
    apellido: string;
    email: string;
  };
  rooms: Room[];
  cuenta?: {
    id: number;
    total: number;
    servicios?: Servicio[];
  };
}