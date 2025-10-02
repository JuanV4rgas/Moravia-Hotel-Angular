import { Usuario } from "./usuario";   

export interface Operador {
    id: number;
    usuario: Usuario;  // relación OneToOne
}
