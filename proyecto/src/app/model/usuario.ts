export interface Usuario {
  idUsuario: number;      // identificador del usuario
  email: string;          // correo electrónico
  clave: string;          // contraseña
  nombre: string;         // nombre de pila
  apellido: string;       // apellido
  cedula: string;         // documento de identidad (string para no perder ceros iniciales)
  telefono: string;       // teléfono
  tipo: string;           // 'cliente' o 'trabajador'
  fotoPerfil?: string;    // opcional (url o base64)
}
