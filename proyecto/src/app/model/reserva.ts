import { Cuenta } from './cuenta';
import { Usuario } from './usuario';
import { Room } from './room';

export interface Reserva {
  id: number;            
  fechaInicio: string;   
  fechaFin: string;        
  estado: string;
  usuario: Usuario;      
  room: Room;       
}
