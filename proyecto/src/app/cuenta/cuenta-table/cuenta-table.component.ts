
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CuentaService } from '../../services/cuenta.service';
import { Cuenta } from '../../model/cuenta';

@Component({
  selector: 'app-cuenta-table',
  templateUrl: './cuenta-table.component.html',
  styleUrls: ['./cuenta-table.component.css']
})
export class CuentaTableComponent implements OnInit {
  cuentas: Cuenta[] = [];

  constructor(
    private cuentaService: CuentaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCuentas();
  }

  cargarCuentas(): void {
    this.cuentaService.getAllCuentas().subscribe({
      next: (data) => {
        this.cuentas = data;
      },
      error: (error) => {
        console.error('Error al cargar cuentas:', error);
      }
    });
  }

  verDetalle(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/cuenta', id]);
    }
  }

  editar(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/cuenta/editar', id]);
    }
  }

  eliminar(id: number | undefined): void {
    if (id !== undefined && confirm('¿Está seguro de que desea eliminar esta cuenta?')) {
      this.cuentaService.deleteCuenta(id).subscribe({
        next: () => {
          this.cargarCuentas();
        },
        error: (error) => {
          console.error('Error al eliminar cuenta:', error);
          alert('Error al eliminar la cuenta');
        }
      });
    }
  }

  agregar(): void {
    this.router.navigate(['/cuenta/nuevo']);
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}
