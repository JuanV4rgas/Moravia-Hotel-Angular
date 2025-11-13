import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReservaService } from './../services/reserva.service';
import { CuentaService } from './../services/cuenta.service';
import { ServicioService } from './../services/servicio.service';
import { UsuarioService } from './../services/usuario.service';
import { RoomService } from './../services/room.service';
import { Reserva } from './../model/reserva';
import { Cuenta } from './../model/cuenta';
import { Servicio } from './../model/servicio';
import { Usuario } from './../model/usuario';
import { Room } from './../model/room';
import * as Chart from 'chart.js';

interface Metricas {
  ocupacion: number;
  ingresos: number;
  reservasActivas: number;
  clientesNuevos: number;
}

interface ServicioTop {
  nombre: string;
  cantidad: number;
  ingresos: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Métricas principales
  metricas: Metricas = {
    ocupacion: 0,
    ingresos: 0,
    reservasActivas: 0,
    clientesNuevos: 0
  };

  // Datos para gráficos
  reservas: Reserva[] = [];
  cuentas: Cuenta[] = [];
  servicios: Servicio[] = [];
  usuarios: Usuario[] = [];
  habitaciones: Room[] = [];

  // Configuración de período
  periodoSeleccionado: 'semana' | 'mes' | 'año' = 'mes';

  // Servicios top
  serviciosTop: ServicioTop[] = [];

  // Referencias a gráficos
  private chartOcupacion: any;
  private chartIngresos: any;
  private chartTipoHabitacion: any;
  private chartEstadoReservas: any;

  // Estado de carga
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private reservaService: ReservaService,
    private cuentaService: CuentaService,
    private servicioService: ServicioService,
    private usuarioService: UsuarioService,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  ngOnDestroy() {
    // Destruir gráficos al salir del componente
    this.destruirGraficos();
  }

  cargarDatos() {
    this.isLoading = true;
    this.errorMessage = '';

    // Cargar todos los datos en paralelo
    Promise.all([
      this.reservaService.getAllReservas().toPromise(),
      this.cuentaService.getAllCuentas().toPromise(),
      this.servicioService.getAllServicios().toPromise(),
      this.usuarioService.getAllUsuarios().toPromise(),
      this.roomService.getAllRooms().toPromise()
    ]).then(([reservas, cuentas, servicios, usuarios, habitaciones]) => {
      this.reservas = reservas || [];
      this.cuentas = cuentas || [];
      this.servicios = servicios || [];
      this.usuarios = usuarios || [];
      this.habitaciones = habitaciones || [];

      this.calcularMetricas();
      this.calcularServiciosTop();
      this.crearGraficos();

      this.isLoading = false;
    }).catch(error => {
      console.error('Error al cargar datos:', error);
      this.errorMessage = 'Error al cargar los datos del dashboard';
      this.isLoading = false;
    });
  }

  calcularMetricas() {
    const fechaFiltro = this.obtenerFechaFiltro();

    // Calcular ocupación
    const habitacionesOcupadas = this.reservas.filter(r => 
      r.estado === 'ACTIVA' && new Date(r.fechaInicio) >= fechaFiltro
    ).length;
    this.metricas.ocupacion = this.habitaciones.length > 0 
      ? Math.round((habitacionesOcupadas / this.habitaciones.length) * 100)
      : 0;

    // Calcular ingresos
    this.metricas.ingresos = this.cuentas
      .filter(c => c.estado === 'PAGADA')
      .reduce((sum, c) => sum + c.total!, 0);

    // Reservas activas
    this.metricas.reservasActivas = this.reservas.filter(r => 
      r.estado === 'ACTIVA' || r.estado === 'CONFIRMADA'
    ).length;

    // Clientes nuevos (últimos 30 días)
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    this.metricas.clientesNuevos = this.usuarios.filter(u => 
      u.tipo === 'cliente'
    ).length;
  }

  calcularServiciosTop() {
    const servicioMap = new Map<number, ServicioTop>();

    this.cuentas.forEach(cuenta => {
      if (cuenta.servicios) {
        cuenta.servicios.forEach(servicio => {
          const id = servicio.idServicio!;
          if (!servicioMap.has(id)) {
            servicioMap.set(id, {
              nombre: servicio.nombre,
              cantidad: 0,
              ingresos: 0
            });
          }
          const item = servicioMap.get(id)!;
          item.cantidad++;
          item.ingresos += servicio.precio;
        });
      }
    });

    this.serviciosTop = Array.from(servicioMap.values())
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 3);
  }

  obtenerFechaFiltro(): Date {
    const fecha = new Date();
    switch (this.periodoSeleccionado) {
      case 'semana':
        fecha.setDate(fecha.getDate() - 7);
        break;
      case 'mes':
        fecha.setMonth(fecha.getMonth() - 1);
        break;
      case 'año':
        fecha.setFullYear(fecha.getFullYear() - 1);
        break;
    }
    return fecha;
  }

  cambiarPeriodo(periodo: 'semana' | 'mes' | 'año') {
    this.periodoSeleccionado = periodo;
    this.calcularMetricas();
    this.destruirGraficos();
    this.crearGraficos();
  }

  crearGraficos() {
    setTimeout(() => {
      this.crearGraficoOcupacion();
      this.crearGraficoIngresos();
      this.crearGraficoTipoHabitacion();
      this.crearGraficoEstadoReservas();
    }, 100);
  }

  crearGraficoOcupacion() {
    const canvas = document.getElementById('chartOcupacion') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const datos = this.obtenerDatosOcupacion();

    this.chartOcupacion = new (Chart as any)(ctx, {
      type: 'line',
      data: {
        labels: datos.labels,
        datasets: [{
          label: 'Ocupación (%)',
          data: datos.valores,
          borderColor: '#1f5f87',
          backgroundColor: 'rgba(31, 95, 135, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }

  crearGraficoIngresos() {
    const canvas = document.getElementById('chartIngresos') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const datos = this.obtenerDatosIngresos();

    this.chartIngresos = new (Chart as any)(ctx, {
      type: 'line',
      data: {
        labels: datos.labels,
        datasets: [{
          label: 'Ingresos ($)',
          data: datos.valores,
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  crearGraficoTipoHabitacion() {
    const canvas = document.getElementById('chartTipoHabitacion') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const datos = this.obtenerDatosTipoHabitacion();

    this.chartTipoHabitacion = new (Chart as any)(ctx, {
      type: 'pie',
      data: {
        labels: datos.labels,
        datasets: [{
          data: datos.valores,
          backgroundColor: [
            '#1f5f87',
            '#17a2b8',
            '#28a745',
            '#ffc107',
            '#dc3545'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right'
          }
        }
      }
    });
  }

  crearGraficoEstadoReservas() {
    const canvas = document.getElementById('chartEstadoReservas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const datos = this.obtenerDatosEstadoReservas();

    this.chartEstadoReservas = new (Chart as any)(ctx, {
      type: 'bar',
      data: {
        labels: datos.labels,
        datasets: [{
          label: 'Cantidad',
          data: datos.valores,
          backgroundColor: [
            '#17a2b8',
            '#28a745',
            '#6c757d',
            '#dc3545',
            '#ffc107'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  obtenerDatosOcupacion() {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const valores: number[] = [];
    
    for (let i = 0; i < 6; i++) {
      const ocupacionMes = Math.floor(Math.random() * 30) + 60;
      valores.push(ocupacionMes);
    }

    return {
      labels: meses.slice(0, 6),
      valores
    };
  }

  obtenerDatosIngresos() {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const valores: number[] = [];
    
    for (let i = 0; i < 6; i++) {
      const ingresoMes = Math.floor(Math.random() * 50000) + 80000;
      valores.push(ingresoMes);
    }

    return { labels: meses, valores };
  }

  obtenerDatosTipoHabitacion() {
    const tipoMap = new Map<string, number>();

    this.reservas.forEach(reserva => {
      reserva.rooms.forEach(room => {
        const tipo = room.type?.name || 'Desconocido';
        tipoMap.set(tipo, (tipoMap.get(tipo) || 0) + 1);
      });
    });

    return {
      labels: Array.from(tipoMap.keys()),
      valores: Array.from(tipoMap.values())
    };
  }

  obtenerDatosEstadoReservas() {
    const estadoMap = new Map<string, number>();

    this.reservas.forEach(reserva => {
      const estado = reserva.estado || 'DESCONOCIDO';
      estadoMap.set(estado, (estadoMap.get(estado) || 0) + 1);
    });

    return {
      labels: Array.from(estadoMap.keys()),
      valores: Array.from(estadoMap.values())
    };
  }

  destruirGraficos() {
    if (this.chartOcupacion) {
      this.chartOcupacion.destroy();
      this.chartOcupacion = null;
    }
    if (this.chartIngresos) {
      this.chartIngresos.destroy();
      this.chartIngresos = null;
    }
    if (this.chartTipoHabitacion) {
      this.chartTipoHabitacion.destroy();
      this.chartTipoHabitacion = null;
    }
    if (this.chartEstadoReservas) {
      this.chartEstadoReservas.destroy();
      this.chartEstadoReservas = null;
    }
  }
}