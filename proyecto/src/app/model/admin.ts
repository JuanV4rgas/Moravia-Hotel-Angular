import { Usuario } from "./usuario";   

export interface Admin {
    id: number;
    usuario: Usuario;  // relación OneToOne
}
