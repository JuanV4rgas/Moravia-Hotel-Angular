import { Cuenta } from './cuenta';

export interface Pago {
  id: number;          
  monto: number;       
  fechaPago: string;   
  cuenta: Cuenta;      
}
