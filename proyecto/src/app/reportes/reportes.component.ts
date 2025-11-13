import { Component, OnInit } from '@angular/core';
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

type TipoReporte = 'ocupacion' | 'financiero' | 'clientes' | 'reservas' | 'servicios';
type FormatoExportacion = 'pdf' | 'excel' | 'csv';

interface ReporteConfig {
  tipo: TipoReporte | null;
  fechaInicio: string;
  fechaFin: string;
  formato: FormatoExportacion;
}

interface DatosReporte {
  titulo: string;
  descripcion: string;
  datos: any[];
  resumen?: any;
}

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  // Configuración del reporte
  config: ReporteConfig = {
    tipo: null,
    fechaInicio: '',
    fechaFin: '',
    formato: 'pdf'
  };

  // Tipos de reportes disponibles
  tiposReporte = [
    {
      id: 'ocupacion' as TipoReporte,
      nombre: 'Reporte de Ocupación',
      descripcion: 'Análisis detallado de ocupación por habitación y período',
      icono: 'fa-bed'
    },
    {
      id: 'financiero' as TipoReporte,
      nombre: 'Reporte Financiero',
      descripcion: 'Ingresos, gastos y utilidades del período',
      icono: 'fa-dollar-sign'
    },
    {
      id: 'clientes' as TipoReporte,
      nombre: 'Reporte de Clientes',
      descripcion: 'Clientes frecuentes y gastos promedio',
      icono: 'fa-users'
    },
    {
      id: 'reservas' as TipoReporte,
      nombre: 'Reporte de Reservas',
      descripcion: 'Estados y tendencias de reservas',
      icono: 'fa-calendar-alt'
    },
    {
      id: 'servicios' as TipoReporte,
      nombre: 'Reporte de Servicios',
      descripcion: 'Servicios más solicitados y rentabilidad',
      icono: 'fa-concierge-bell'
    }
  ];

  // Datos
  reservas: Reserva[] = [];
  cuentas: Cuenta[] = [];
  servicios: Servicio[] = [];
  usuarios: Usuario[] = [];
  habitaciones: Room[] = [];

  // Vista previa del reporte
  vistaPrevia: DatosReporte | null = null;
  mostrandoVistaPrevia: boolean = false;

  // Estado
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private reservaService: ReservaService,
    private cuentaService: CuentaService,
    private servicioService: ServicioService,
    private usuarioService: UsuarioService,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.inicializarFechas();
    this.cargarDatos();
  }

  inicializarFechas() {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    this.config.fechaFin = hoy.toISOString().split('T')[0];
    this.config.fechaInicio = hace30Dias.toISOString().split('T')[0];
  }

  cargarDatos() {
    this.isLoading = true;
    this.errorMessage = '';

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
      this.isLoading = false;
    }).catch(error => {
      console.error('Error al cargar datos:', error);
      this.errorMessage = 'Error al cargar los datos para reportes';
      this.isLoading = false;
    });
  }

  seleccionarTipo(tipo: TipoReporte) {
    this.config.tipo = tipo;
    this.mostrandoVistaPrevia = false;
    this.vistaPrevia = null;
  }

  generarVistaPrevia() {
    if (!this.config.tipo) {
      this.errorMessage = 'Selecciona un tipo de reporte';
      return;
    }

    if (!this.config.fechaInicio || !this.config.fechaFin) {
      this.errorMessage = 'Selecciona el rango de fechas';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    setTimeout(() => {
      switch (this.config.tipo) {
        case 'ocupacion':
          this.vistaPrevia = this.generarReporteOcupacion();
          break;
        case 'financiero':
          this.vistaPrevia = this.generarReporteFinanciero();
          break;
        case 'clientes':
          this.vistaPrevia = this.generarReporteClientes();
          break;
        case 'reservas':
          this.vistaPrevia = this.generarReporteReservas();
          break;
        case 'servicios':
          this.vistaPrevia = this.generarReporteServicios();
          break;
      }

      this.mostrandoVistaPrevia = true;
      this.isLoading = false;
    }, 500);
  }

  generarReporteOcupacion(): DatosReporte {
    const reservasFiltradas = this.filtrarPorFechas(this.reservas);
    
    const ocupacionPorHabitacion = this.habitaciones.map(hab => {
      const reservasHab = reservasFiltradas.filter(r =>
        r.rooms.some(room => room.id === hab.id)
      );

      return {
        habitacion: `Habitación ${hab.habitacionNumber}`,
        tipo: hab.type?.name || 'N/A',
        reservas: reservasHab.length,
        diasOcupados: this.calcularDiasOcupados(reservasHab),
        tasaOcupacion: this.calcularTasaOcupacion(reservasHab)
      };
    });

    const totalReservas = reservasFiltradas.length;
    const promedioOcupacion = ocupacionPorHabitacion.reduce((sum, h) => sum + h.tasaOcupacion, 0) / this.habitaciones.length;

    return {
      titulo: 'Reporte de Ocupación',
      descripcion: `Análisis de ocupación del ${this.config.fechaInicio} al ${this.config.fechaFin}`,
      datos: ocupacionPorHabitacion,
      resumen: {
        totalReservas,
        promedioOcupacion: Math.round(promedioOcupacion)
      }
    };
  }

  generarReporteFinanciero(): DatosReporte {
    const cuentasFiltradas = this.filtrarCuentasPorFechas();
    
    const ingresosTotales = cuentasFiltradas
      .filter(c => c.estado === 'PAGADA')
      .reduce((sum, c) => sum + c.total!, 0);

    const ingresosPorConcepto = [
      {
        concepto: 'Habitaciones',
        monto: cuentasFiltradas.reduce((sum, c) => {
          // Calcular solo habitaciones (asumiendo que el total incluye servicios)
          const servicios = c.servicios?.reduce((s, srv) => s + srv.precio, 0) || 0;
          return sum + (c.total! - servicios);
        }, 0)
      },
      {
        concepto: 'Servicios',
        monto: cuentasFiltradas.reduce((sum, c) => {
          const servicios = c.servicios?.reduce((s, srv) => s + srv.precio, 0) || 0;
          return sum + servicios;
        }, 0)
      }
    ];

    return {
      titulo: 'Reporte Financiero',
      descripcion: `Análisis financiero del ${this.config.fechaInicio} al ${this.config.fechaFin}`,
      datos: ingresosPorConcepto,
      resumen: {
        ingresosTotales,
        cuentasPagadas: cuentasFiltradas.filter(c => c.estado === 'PAGADA').length,
        cuentasPendientes: cuentasFiltradas.filter(c => c.estado !== 'PAGADA').length
      }
    };
  }

  generarReporteClientes(): DatosReporte {
    const reservasFiltradas = this.filtrarPorFechas(this.reservas);
    
    const clientesMap = new Map<number, any>();
    
    reservasFiltradas.forEach(reserva => {
      const clienteId = reserva.cliente.idUsuario;
      if (!clientesMap.has(clienteId)) {
        clientesMap.set(clienteId, {
          nombre: `${reserva.cliente.nombre} ${reserva.cliente.apellido}`,
          email: reserva.cliente.email,
          reservas: 0,
          gastoTotal: 0
        });
      }
      
      const cliente = clientesMap.get(clienteId);
      cliente.reservas++;
      
      if (reserva.cuenta) {
        cliente.gastoTotal += reserva.cuenta.total;
      }
    });

    const datosClientes = Array.from(clientesMap.values())
      .sort((a, b) => b.reservas - a.reservas)
      .slice(0, 10)
      .map(c => ({
        ...c,
        gastoPromedio: c.gastoTotal / c.reservas
      }));

    const totalClientes = clientesMap.size;
    const gastoPromedio = datosClientes.reduce((sum, c) => sum + c.gastoPromedio, 0) / datosClientes.length;

    return {
      titulo: 'Reporte de Clientes',
      descripcion: `Top 10 clientes del ${this.config.fechaInicio} al ${this.config.fechaFin}`,
      datos: datosClientes,
      resumen: {
        totalClientes,
        gastoPromedio: Math.round(gastoPromedio)
      }
    };
  }

  generarReporteReservas(): DatosReporte {
    const reservasFiltradas = this.filtrarPorFechas(this.reservas);
    
    const estadoMap = new Map<string, number>();
    reservasFiltradas.forEach(r => {
      const estado = r.estado || 'DESCONOCIDO';
      estadoMap.set(estado, (estadoMap.get(estado) || 0) + 1);
    });

    const datosEstados = Array.from(estadoMap.entries()).map(([estado, cantidad]) => ({
      estado,
      cantidad,
      porcentaje: Math.round((cantidad / reservasFiltradas.length) * 100)
    }));

    return {
      titulo: 'Reporte de Reservas',
      descripcion: `Estados de reservas del ${this.config.fechaInicio} al ${this.config.fechaFin}`,
      datos: datosEstados,
      resumen: {
        totalReservas: reservasFiltradas.length,
        reservasActivas: estadoMap.get('ACTIVA') || 0,
        reservasConfirmadas: estadoMap.get('CONFIRMADA') || 0
      }
    };
  }

  generarReporteServicios(): DatosReporte {
    const cuentasFiltradas = this.filtrarCuentasPorFechas();
    
    const serviciosMap = new Map<number, any>();
    
    cuentasFiltradas.forEach(cuenta => {
      if (cuenta.servicios) {
        cuenta.servicios.forEach(servicio => {
          const id = servicio.idServicio!;
          if (!serviciosMap.has(id)) {
            serviciosMap.set(id, {
              nombre: servicio.nombre,
              cantidad: 0,
              ingresos: 0
            });
          }
          const item = serviciosMap.get(id);
          item.cantidad++;
          item.ingresos += servicio.precio;
        });
      }
    });

    const datosServicios = Array.from(serviciosMap.values())
      .sort((a, b) => b.cantidad - a.cantidad)
      .map(s => ({
        ...s,
        precioPromedio: s.ingresos / s.cantidad
      }));

    const totalServicios = datosServicios.reduce((sum, s) => sum + s.cantidad, 0);
    const ingresosServicios = datosServicios.reduce((sum, s) => sum + s.ingresos, 0);

    return {
      titulo: 'Reporte de Servicios',
      descripcion: `Servicios solicitados del ${this.config.fechaInicio} al ${this.config.fechaFin}`,
      datos: datosServicios,
      resumen: {
        totalServicios,
        ingresosServicios,
        tiposServicios: datosServicios.length
      }
    };
  }

  filtrarPorFechas(reservas: Reserva[]): Reserva[] {
    const inicio = new Date(this.config.fechaInicio);
    const fin = new Date(this.config.fechaFin);

    return reservas.filter(r => {
      const fechaInicio = new Date(r.fechaInicio);
      return fechaInicio >= inicio && fechaInicio <= fin;
    });
  }

  filtrarCuentasPorFechas(): Cuenta[] {
    const reservasFiltradas = this.filtrarPorFechas(this.reservas);
    const reservaIds = new Set(reservasFiltradas.map(r => r.id));
    
    return this.cuentas.filter(c => {
      // Buscar la reserva asociada a esta cuenta
      const reservaAsociada = this.reservas.find(r => r.cuenta?.id === c.id);
      return reservaAsociada && reservaIds.has(reservaAsociada.id);
    });
  }

  calcularDiasOcupados(reservas: Reserva[]): number {
    return reservas.reduce((sum, r) => {
      const inicio = new Date(r.fechaInicio);
      const fin = new Date(r.fechaFin);
      const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
      return sum + dias;
    }, 0);
  }

  calcularTasaOcupacion(reservas: Reserva[]): number {
    const diasOcupados = this.calcularDiasOcupados(reservas);
    const inicio = new Date(this.config.fechaInicio);
    const fin = new Date(this.config.fechaFin);
    const diasPeriodo = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    
    return diasPeriodo > 0 ? Math.round((diasOcupados / diasPeriodo) * 100) : 0;
  }

  exportarReporte() {
    if (!this.vistaPrevia) {
      this.errorMessage = 'Genera una vista previa primero';
      return;
    }

    this.successMessage = `Reporte exportado como ${this.config.formato.toUpperCase()}`;
    
    // Simular exportación
    console.log('Exportando reporte:', {
      tipo: this.config.tipo,
      formato: this.config.formato,
      datos: this.vistaPrevia
    });

    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  limpiarFormulario() {
    this.config.tipo = null;
    this.vistaPrevia = null;
    this.mostrandoVistaPrevia = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.inicializarFechas();
  }

  formatearLabel(key: unknown): string {
    const keyStr = String(key);
    const labels: { [key: string]: string } = {
      'totalReservas': 'Total Reservas',
      'promedioOcupacion': 'Ocupación Promedio',
      'ingresosTotales': 'Ingresos Totales',
      'cuentasPagadas': 'Cuentas Pagadas',
      'cuentasPendientes': 'Cuentas Pendientes',
      'totalClientes': 'Total Clientes',
      'gastoPromedio': 'Gasto Promedio',
      'reservasActivas': 'Reservas Activas',
      'reservasConfirmadas': 'Reservas Confirmadas',
      'totalServicios': 'Total Servicios',
      'ingresosServicios': 'Ingresos por Servicios',
      'tiposServicios': 'Tipos de Servicios'
    };
    return labels[keyStr] || keyStr;
  }

  formatearValor(value: any): string {
    if (typeof value === 'number') {
      // Si es un número grande, formatearlo como moneda
      if (value > 1000) {
        return "'"
 + value.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      }
      // Si es un porcentaje
      if (value <= 100) {
        return value + (value > 1 ? '' : '');
      }
      return value.toString();
    }
    return value;
  }
}