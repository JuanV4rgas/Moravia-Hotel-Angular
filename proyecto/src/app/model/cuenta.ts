import { Servicio } from './servicio';

export interface Cuenta {
  id?: number;
  estado?: string;  // ABIERTA, CERRADA, PAGADA, PENDIENTE
  total?: number;
  reserva?: { 
    id: number; 
    fechaInicio: string; 
    fechaFin: string; 
    estado: string; 
  };
  servicios?: Servicio[];
}