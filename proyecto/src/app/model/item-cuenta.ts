import { Cuenta } from './cuenta';
import { Servicio } from './servicio';

export interface ItemCuenta {
  id: number;        
  cantidad: number;  
  precioItem: number;
  cuenta: Cuenta;    
  servicio: Servicio;
}
