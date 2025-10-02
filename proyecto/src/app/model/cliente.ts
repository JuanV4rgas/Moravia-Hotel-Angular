import { Usuario } from "./usuario";   

export interface Cliente {
    id: number;
    usuario: Usuario;  // relación OneToOne
}