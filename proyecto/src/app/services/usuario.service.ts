import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Usuario } from '../model/usuario';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:8081/usuario';

  constructor(private http: HttpClient) {}

  // ======= LISTA =======
  getAllUsuarios(): Observable<Usuario[]> {
    // Lo pedimos como texto para evitar el parser JSON de Angular
    return this.http.get(`${this.apiUrl}/all`, { responseType: 'text' as const }).pipe(
      map(raw => {
        // 1) Intento parsear el arreglo completo
        const arr = this.tryParseArray(raw);
        // 2) Mapeo plano (sin campos pesados)
        return arr.map(objTxt => this.toUsuarioPlano(this.parseCleanObject(objTxt)));
      })
    );
  }

  // ======= DETALLE =======
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get(`${this.apiUrl}/find/${id}`, { responseType: 'text' as const }).pipe(
      map(raw => {
        // Si por error viene envuelto en arreglo, lo manejo igual
        const parts = this.splitTopLevelArray(raw);
        const one = parts.length ? parts[0] : raw;
        return this.toUsuarioPlano(this.parseCleanObject(one));
      })
    );
  }

  // ======= CRUD =======
  addUsuario(payload: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, payload);
  }
  updateUsuario(id: number, payload: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, payload);
  }
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Compat
  getUsuario(id: number) { return this.getUsuarioById(id); }
  update(id: number, p: Usuario) { return this.updateUsuario(id, p); }
  getById(id: number) { return this.getUsuarioById(id); }

  // ================== HELPERS ==================

  /** Intenta JSON.parse del array completo; si falla, divide a nivel top y devuelve cada objeto como texto limpio */
  private tryParseArray(text: string): string[] {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        // si ya es JSON válido, reconvierto cada objeto a texto para un flujo homogéneo
        return parsed.map(o => JSON.stringify(o));
      }
    } catch { /* cae al split */ }
    // Fallback robusto: corto el arreglo top-level en objetos ({...}) balanceados
    return this.splitTopLevelArray(text);
  }

  /**
   * Divide un JSON con un arreglo top-level en strings "{...}" de objetos individuales,
   * respetando balance de llaves y comillas. Ej: "[{...},{...}]" -> ["{...}","{...}"]
   */
  private splitTopLevelArray(text: string): string[] {
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start === -1 || end === -1 || end <= start) return [];

    let i = start + 1;
    const n = text.length;
    const out: string[] = [];
    let buf = '';
    let depth = 0;

    const readString = () => {
      let s = '"';
      i++;
      while (i < n) {
        const c = text[i];
        s += c; i++;
        if (c === '\\') { if (i < n) { s += text[i]; i++; } continue; }
        if (c === '"') break;
      }
      return s;
    };

    while (i < end) {
      const c = text[i];
      if (c === '"') { buf += readString(); continue; }
      if (c === '{') { depth++; buf += c; i++; continue; }
      if (c === '}') { depth--; buf += c; i++; continue; }
      if (c === ',' && depth === 0) { // separador de objetos top-level
        if (buf.trim()) out.push(buf.trim());
        buf = ''; i++; continue;
      }
      buf += c; i++;
    }
    if (buf.trim()) out.push(buf.trim());
    return out;
  }

  /**
   * Limpia SOLO dentro de un objeto en texto:
   * - Remueve (balanceado) las claves "reservas": [ ... ]
   * - Remueve (balanceado) las claves "cliente": { ... }
   * Luego parsea y retorna el objeto.
   */
  private parseCleanObject(objText: string): any {
    const cleaned = this.removeBalancedField(this.removeBalancedField(objText, 'reservas', '[' ,']'),
                                            'cliente', '{', '}');
    try {
      return JSON.parse(cleaned);
    } catch (e) {
      // Si aún falla por algún detalle de comas, intento quitar comas colgantes comunes
      const fixed = cleaned.replace(/,\s*([\]}])/g, '$1');
      return JSON.parse(fixed);
    }
  }

  /**
   * Elimina en TEXTO el valor balanceado de una clave concreta.
   * Ej: removeBalancedField(str, 'reservas', '[', ']') => borra `"reservas": [ ... ]`
   */
  private removeBalancedField(input: string, key: string, open: string, close: string): string {
    let i = 0, out = '';
    const n = input.length;

    const isWS = (c: string) => c === ' ' || c === '\n' || c === '\r' || c === '\t';

    const readQuoted = () => {
      let s = '"'; i++;
      while (i < n) {
        const c = input[i]; s += c; i++;
        if (c === '\\') { if (i < n) { s += input[i]; i++; } continue; }
        if (c === '"') break;
      }
      return s;
    };

    while (i < n) {
      const c = input[i];
      if (c === '"') {
        // ¿Es la clave?
        const start = i;
        const q = readQuoted(); // incluye comillas
        const keyName = q.slice(1, -1);
        if (keyName === key) {
          out += q;
          // saltar opcional espacios y dos puntos
          while (i < n && isWS(input[i])) { out += input[i]; i++; }
          if (input[i] === ':') { out += ':'; i++; }
          while (i < n && isWS(input[i])) { /* NO escribir estos WS para poder poner valor vacío */ i++; }
          // si no viene el delimitador esperado, no tocamos
          if (input[i] !== open) { out += input[i] ?? ''; i++; continue; }
          // saltar todo el valor balanceado
          let depth = 0; i++; depth++;
          while (i < n && depth > 0) {
            const ch = input[i];
            if (ch === '"') { readQuoted(); continue; }
            if (ch === open) { depth++; i++; continue; }
            if (ch === close) { depth--; i++; continue; }
            i++;
          }
          // escribimos valor vacío adecuado y seguimos
          out += (open === '[' ? '[]' : '{}');
          // eliminar posible coma colgante inmediatamente después
          // (NO la escribimos; dejamos que el resto fluya)
          // pero si lo siguiente es coma, la dejamos y que el fix final la maneje
          continue;
        } else {
          // otra clave/string normal
          out += q;
          continue;
        }
      }
      out += c; i++;
    }

    // limpieza de comas tipo ", ]" o ", }"
    return out.replace(/,\s*([\]}])/g, '$1');
  }

  /** Mapea a tu interfaz de UI (sin campos pesados) */
  private toUsuarioPlano(u: any): Usuario {
    return {
      idUsuario: u.idUsuario,
      email: u.email,
      clave: u.clave,
      nombre: u.nombre,
      apellido: u.apellido,
      cedula: u.cedula,
      telefono: u.telefono,
      fotoPerfil: u.fotoPerfil
    };
  }
}
