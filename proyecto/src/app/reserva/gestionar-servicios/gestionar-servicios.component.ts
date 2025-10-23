import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { ServicioService } from '../../services/servicio.service';
import { CuentaService } from '../../services/cuenta.service';
import { Reserva } from '../../model/reserva';
import { Servicio } from '../../model/servicio';
import { Cuenta } from '../../model/cuenta';

@Component({
  selector: 'app-gestionar-servicios',
  templateUrl: './gestionar-servicios.component.html',
  styleUrls: ['./gestionar-servicios.component.css']
})
export class GestionarServiciosComponent implements OnInit {
  reserva: Reserva | null = null;
  servicios: Servicio[] = [];
  serviciosEnCuenta: Servicio[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservaService: ReservaService,
    private servicioService: ServicioService,
    private cuentaService: CuentaService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarReserva(parseInt(id));
      this.cargarServicios();
    }
  }

  cargarReserva(id: number): void {
    this.isLoading = true;
    this.reservaService.getReservaById(id).subscribe({
      next: (reserva) => {
        this.reserva = reserva;
        if (reserva.cuenta && reserva.cuenta.servicios) {
          this.serviciosEnCuenta = reserva.cuenta.servicios;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar reserva:', error);
        this.errorMessage = 'Error al cargar la reserva';
        this.isLoading = false;
      }
    });
  }

  cargarServicios(): void {
    this.servicioService.getAllServicios().subscribe({
      next: (servicios) => {
        this.servicios = servicios;
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.errorMessage = 'Error al cargar los servicios';
      }
    });
  }

  agregarServicioACuenta(servicio: Servicio): void {
    if (!this.reserva) return;

    // Verificar si el servicio ya está en la cuenta
    const yaExiste = this.serviciosEnCuenta.some(s => s.idServicio === servicio.idServicio);
    if (yaExiste) {
      alert('Este servicio ya está en la cuenta del cliente');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Obtener o crear cuenta
    let cuenta = this.reserva.cuenta;
    if (!cuenta) {
      // Crear nueva cuenta
      cuenta = {
        id: 0, // ID temporal, será asignado por el backend
        total: this.calcularTotalHabitaciones(),
        servicios: []
      };
    }

    // Agregar servicio
    if (!cuenta.servicios) {
      cuenta.servicios = [];
    }
    cuenta.servicios.push(servicio);

    // Recalcular total
    const totalHabitaciones = this.calcularTotalHabitaciones();
    const totalServicios = cuenta.servicios.reduce((total, s) => total + s.precio, 0);
    cuenta.total = totalHabitaciones + totalServicios;

    // Actualizar cuenta
    if (cuenta.id) {
      this.cuentaService.updateCuenta(cuenta).subscribe({
        next: () => {
          this.successMessage = 'Servicio agregado exitosamente';
          this.serviciosEnCuenta = [...(cuenta?.servicios || [])];
          this.isLoading = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error al agregar servicio:', error);
          this.errorMessage = 'Error al agregar el servicio';
          this.isLoading = false;
        }
      });
    } else {
      this.cuentaService.addCuenta(cuenta).subscribe({
        next: (cuentaCreada) => {
          this.successMessage = 'Servicio agregado exitosamente';
          this.serviciosEnCuenta = [...(cuenta?.servicios || [])];
          this.reserva!.cuenta = cuentaCreada as any;
          this.isLoading = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error al crear cuenta:', error);
          this.errorMessage = 'Error al crear la cuenta';
          this.isLoading = false;
        }
      });
    }
  }

  eliminarServicioDeCuenta(servicio: Servicio): void {
    if (!this.reserva || !this.reserva.cuenta) return;

    const ok = confirm(`¿Eliminar el servicio "${servicio.nombre}" de la cuenta?`);
    if (!ok) return;

    this.isLoading = true;
    this.errorMessage = '';

    const cuenta = { ...this.reserva.cuenta };
    cuenta.servicios = (cuenta.servicios || []).filter(s => s.idServicio !== servicio.idServicio);

    // Recalcular total
    const totalHabitaciones = this.calcularTotalHabitaciones();
    const totalServicios = cuenta.servicios.reduce((total, s) => total + s.precio, 0);
    cuenta.total = totalHabitaciones + totalServicios;

    this.cuentaService.updateCuenta(cuenta).subscribe({
      next: () => {
        this.successMessage = 'Servicio eliminado exitosamente';
        this.serviciosEnCuenta = [...(cuenta.servicios || [])];
        this.reserva!.cuenta = cuenta;
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error al eliminar servicio:', error);
        this.errorMessage = 'Error al eliminar el servicio';
        this.isLoading = false;
      }
    });
  }

  calcularTotalHabitaciones(): number {
    if (!this.reserva) return 0;
    
    let total = 0;
    const fechaInicio = new Date(this.reserva.fechaInicio);
    const fechaFin = new Date(this.reserva.fechaFin);
    const noches = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    
    for (const room of this.reserva.rooms) {
      total += room.type.price * noches;
    }
    
    return total;
  }

  calcularTotalServicios(): number {
    return this.serviciosEnCuenta.reduce((total, servicio) => total + servicio.precio, 0);
  }

  calcularTotalCuenta(): number {
    const totalHabitaciones = this.calcularTotalHabitaciones();
    const totalServicios = this.calcularTotalServicios();
    return totalHabitaciones + totalServicios;
  }

  volverATabla(): void {
    this.router.navigate(['/reserva/table']);
  }

  onImageError(event: any): void {
    event.target.src = 'assets/img/image1817.png';
  }

  getEstadoClass(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'INACTIVA':
        return 'INACTIVA';
      case 'ACTIVA':
        return 'ACTIVA';
      case 'CONFIRMADA':
        return 'CONFIRMADA';
      case 'FINALIZADA':
        return 'FINALIZADA';
      case 'CANCELADA':
        return 'CANCELADA';
      default:
        return '';
    }
  }
}
