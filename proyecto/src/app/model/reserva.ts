// Importar Room desde el modelo unificado
import { Room } from './room';
import { Servicio } from './servicio';

export interface Reserva {
  id?: number;
  fechaInicio: string; // ISO date string
  fechaFin: string;    // ISO date string
  estado: string;      // 'CONFIRMADA', 'PENDIENTE', 'CANCELADA', 'PROXIMA', 'FINALIZADA'
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

export interface RoomType {
  id: string;
  name: string;
  price: number;
  description: string;
  capacity: string;
  numberOfBeds: number;
  image: string;
  type: string;
}