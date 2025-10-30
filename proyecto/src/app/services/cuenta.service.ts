import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cuenta } from '../model/cuenta';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private apiUrl = 'http://localhost:8081/cuenta';

  constructor(private http: HttpClient) { }

  getAllCuentas(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(`${this.apiUrl}/all`);
  }

  getCuentaById(id: number): Observable<Cuenta> {
    return this.http.get<Cuenta>(`${this.apiUrl}/find/${id}`);
  }

  addCuenta(cuenta: Cuenta): Observable<Cuenta> {
    return this.http.post<Cuenta>(`${this.apiUrl}/add`, cuenta);
  }

  updateCuenta(cuenta: Cuenta): Observable<Cuenta> {
    return this.http.post<Cuenta>(`${this.apiUrl}/update/${cuenta.id}`, cuenta);
  }

  deleteCuenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
