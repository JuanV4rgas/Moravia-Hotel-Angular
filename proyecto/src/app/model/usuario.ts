export interface Usuario {
  idUsuario: number;   
  email: string;
  clave: string;         // En frontend normalmente no se guarda la clave
  nombre: string;
  apellido: string;
  cedula: string;
  telefono?: string;     
  fotoPerfil?: string;   
}
