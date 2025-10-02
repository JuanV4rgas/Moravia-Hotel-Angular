import { Reserva } from './reserva';
import { ItemCuenta } from './item-cuenta';
import { Pago } from './pago';

export interface Cuenta {
  id: number;          
  estado: string;
  total: number;       
  reserva: Reserva;    
  items: ItemCuenta[]; 
  pagos: Pago[];       
}
