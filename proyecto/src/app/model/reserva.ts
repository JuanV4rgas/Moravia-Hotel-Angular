import { Cliente } from './cliente';
import { Habitacion } from './room';
import { Cuenta } from './cuenta';

export interface Reserva {
  id: number;            
  fechaInicio: string;   
  fechaFin: string;      
  cantPersonas: number;  
  estado: string;
  cliente: Cliente;      
  habitacion: Habitacion;
  cuenta?: Cuenta;       
}
