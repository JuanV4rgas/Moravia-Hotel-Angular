export interface Usuario {
  idUsuario: number;   
  email: string;
  clave: string;         
  nombre: string;
  apellido: string;
  cedula: string;
  telefono?: string;     
  fotoPerfil?: string;   
  tipo: string;
}
