import { Usuario } from "./usuario";
import { Reserva } from "./reserva";

export interface Cliente extends Usuario {
  reservas?: Reserva[];   // reservas asociadas
}
