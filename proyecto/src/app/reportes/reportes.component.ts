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

      console.log('✓ Datos cargados para reportes:', {
        reservas: this.reservas.length,
        cuentas: this.cuentas.length,
        servicios: this.servicios.length,
        usuarios: this.usuarios.length,
        habitaciones: this.habitaciones.length
      });

      this.isLoading = false;
    }).catch(error => {
      console.error('✗ Error al cargar datos:', error);
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
    
    console.log('🏨 Generando reporte de ocupación con', this.habitaciones.length, 'habitaciones y', reservasFiltradas.length, 'reservas');
    
    const ocupacionPorHabitacion = this.habitaciones.map(hab => {
      const reservasHab = reservasFiltradas.filter(r =>
        r.rooms.some(room => room.id === hab.id) &&
        (r.estado === 'ACTIVA' || r.estado === 'CONFIRMADA' || r.estado === 'FINALIZADA')
      );

      const diasOcupados = this.calcularDiasOcupados(reservasHab);
      const tasaOcupacion = this.calcularTasaOcupacion(reservasHab);

      return {
        habitacion: `Habitación ${hab.habitacionNumber}`,
        tipo: hab.type?.name || 'N/A',
        reservas: reservasHab.length,
        diasOcupados,
        tasaOcupacion
      };
    });

    console.log('  Ocupación por habitación:', ocupacionPorHabitacion);

    const totalReservas = reservasFiltradas.filter(r => 
      r.estado === 'ACTIVA' || r.estado === 'CONFIRMADA' || r.estado === 'FINALIZADA'
    ).length;
    
    const promedioOcupacion = ocupacionPorHabitacion.length > 0
      ? Math.round(ocupacionPorHabitacion.reduce((sum, h) => sum + h.tasaOcupacion, 0) / ocupacionPorHabitacion.length)
      : 0;

    return {
      titulo: 'Reporte de Ocupación',
      descripcion: `Análisis de ocupación del ${this.config.fechaInicio} al ${this.config.fechaFin}`,
      datos: ocupacionPorHabitacion,
      resumen: {
        totalReservas,
        promedioOcupacion
      }
    };
  }

  generarReporteFinanciero(): DatosReporte {
    const cuentasFiltradas = this.filtrarCuentasPorFechas();

    console.log('💰 Generando reporte financiero con', cuentasFiltradas.length, 'cuentas');

    // Calcular ingresos por habitaciones (total - servicios)
    const ingresosHabitaciones = cuentasFiltradas.reduce((sum, c) => {
      const serviciosTotal = c.servicios?.reduce((s, srv) => s + srv.precio, 0) || 0;
      const totalCuenta = c.total || 0;
      return sum + (totalCuenta - serviciosTotal);
    }, 0);

    // Calcular ingresos por servicios
    const ingresosServicios = cuentasFiltradas.reduce((sum, c) => {
      const serviciosTotal = c.servicios?.reduce((s, srv) => s + srv.precio, 0) || 0;
      return sum + serviciosTotal;
    }, 0);

    const ingresosTotales = ingresosHabitaciones + ingresosServicios;

    const ingresosPorConcepto = [
      {
        concepto: 'Habitaciones',
        monto: Math.round(ingresosHabitaciones)
      },
      {
        concepto: 'Servicios',
        monto: Math.round(ingresosServicios)
      },
      {
        concepto: 'TOTAL',
        monto: Math.round(ingresosTotales)
      }
    ];

    console.log('  Ingresos calculados:', ingresosPorConcepto);

    return {
      titulo: 'Reporte Financiero',
      descripcion: `Análisis financiero del ${this.config.fechaInicio} al ${this.config.fechaFin}`,
      datos: ingresosPorConcepto,
      resumen: {
        ingresosTotales: Math.round(ingresosTotales),
        cuentasPagadas: cuentasFiltradas.filter(c => c.estado === 'PAGADA' || c.estado === 'CERRADA').length,
        cuentasPendientes: cuentasFiltradas.filter(c => c.estado === 'ABIERTA' || c.estado === 'PENDIENTE').length
      }
    };
  }

  generarReporteClientes(): DatosReporte {
    const reservasFiltradas = this.filtrarPorFechas(this.reservas);
    
    console.log('👥 Generando reporte de clientes con', reservasFiltradas.length, 'reservas');
    
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

      // Buscar la cuenta asociada a esta reserva
      const cuenta = this.cuentas.find(c => c.reserva?.id === reserva.id);
      if (cuenta) {
        cliente.gastoTotal += (cuenta.total || 0);
      }
    });

    const datosClientes = Array.from(clientesMap.values())
      .sort((a, b) => b.gastoTotal - a.gastoTotal)
      .slice(0, 10)
      .map(c => ({
        ...c,
        gastoTotal: Math.round(c.gastoTotal),
        gastoPromedio: Math.round(c.gastoTotal / c.reservas)
      }));

    console.log('  Top 10 clientes:', datosClientes);

    const totalClientes = clientesMap.size;
    const gastoPromedio = datosClientes.length > 0 
      ? Math.round(datosClientes.reduce((sum, c) => sum + c.gastoPromedio, 0) / datosClientes.length)
      : 0;

    return {
      titulo: 'Reporte de Clientes',
      descripcion: `Top 10 clientes del ${this.config.fechaInicio} al ${this.config.fechaFin}`,
      datos: datosClientes,
      resumen: {
        totalClientes,
        gastoPromedio
      }
    };
  }

  generarReporteReservas(): DatosReporte {
    const reservasFiltradas = this.filtrarPorFechas(this.reservas);
    
    console.log('📋 Generando reporte de reservas con', reservasFiltradas.length, 'reservas');

    const estadoMap = new Map<string, number>();
    reservasFiltradas.forEach(r => {
      const estado = r.estado || 'DESCONOCIDO';
      estadoMap.set(estado, (estadoMap.get(estado) || 0) + 1);
    });

    const datosEstados = Array.from(estadoMap.entries()).map(([estado, cantidad]) => ({
      estado,
      cantidad,
      porcentaje: reservasFiltradas.length > 0 
        ? Math.round((cantidad / reservasFiltradas.length) * 100)
        : 0
    }));

    console.log('  Estados de reservas:', datosEstados);

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
    
    console.log('🛎️ Generando reporte de servicios con', cuentasFiltradas.length, 'cuentas');

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
        ingresos: Math.round(s.ingresos),
        precioPromedio: Math.round(s.ingresos / s.cantidad)
      }));

    console.log('  Servicios encontrados:', datosServicios);

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
    const inicio = new Date(this.config.fechaInicio);
    const fin = new Date(this.config.fechaFin);

    return this.cuentas.filter(c => {
      if (!c.reserva || !c.reserva.fechaInicio) return false;
      const fechaReserva = new Date(c.reserva.fechaInicio);
      return fechaReserva >= inicio && fechaReserva <= fin;
    });
  }

  calcularDiasOcupados(reservas: Reserva[]): number {
    return reservas.reduce((sum, r) => {
      const inicio = new Date(r.fechaInicio);
      const fin = new Date(r.fechaFin);
      const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
      return sum + Math.max(dias, 1); // Al menos 1 día
    }, 0);
  }

  calcularTasaOcupacion(reservas: Reserva[]): number {
    const diasOcupados = this.calcularDiasOcupados(reservas);
    const inicio = new Date(this.config.fechaInicio);
    const fin = new Date(this.config.fechaFin);
    const diasPeriodo = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    
    return diasPeriodo > 0 ? Math.min(Math.round((diasOcupados / diasPeriodo) * 100), 100) : 0;
  }

  exportarReporte() {
    if (!this.vistaPrevia) {
      this.errorMessage = 'Genera una vista previa primero';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      switch (this.config.formato) {
        case 'csv':
          this.exportarCSV();
          break;
        case 'excel':
          this.exportarExcel();
          break;
        case 'pdf':
          this.exportarPDF();
          break;
      }

      this.successMessage = `Reporte exportado como ${this.config.formato.toUpperCase()}`;
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } catch (error) {
      console.error('Error al exportar reporte:', error);
      this.errorMessage = 'Error al exportar el reporte';
    } finally {
      this.isLoading = false;
    }
  }

  private exportarCSV() {
    if (!this.vistaPrevia) return;

    let csv = '';

    // Encabezado
    csv += `${this.vistaPrevia.titulo}\n`;
    csv += `${this.vistaPrevia.descripcion}\n\n`;

    // Resumen
    if (this.vistaPrevia.resumen) {
      csv += 'RESUMEN\n';
      Object.entries(this.vistaPrevia.resumen).forEach(([key, value]) => {
        csv += `${this.formatearLabel(key)},${value}\n`;
      });
      csv += '\n';
    }

    // Datos
    csv += 'DATOS\n';
    if (this.vistaPrevia.datos.length > 0) {
      const headers = Object.keys(this.vistaPrevia.datos[0]);
      csv += headers.join(',') + '\n';

      this.vistaPrevia.datos.forEach(row => {
        csv += headers.map(h => {
          const value = (row as any)[h];
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',') + '\n';
      });
    }

    this.descargarArchivo(csv, `reporte_${this.config.tipo}_${new Date().getTime()}.csv`, 'text/csv');
  }

  private exportarExcel() {
    if (!this.vistaPrevia) return;

    let html = '<html><head><meta charset="utf-8"></head><body>';
    html += `<h1>${this.vistaPrevia.titulo}</h1>`;
    html += `<p>${this.vistaPrevia.descripcion}</p>`;

    // Resumen
    if (this.vistaPrevia.resumen) {
      html += '<h3>Resumen</h3><table border="1"><tr><th>Métrica</th><th>Valor</th></tr>';
      Object.entries(this.vistaPrevia.resumen).forEach(([key, value]) => {
        html += `<tr><td>${this.formatearLabel(key)}</td><td>${value}</td></tr>`;
      });
      html += '</table>';
    }

    // Datos
    if (this.vistaPrevia.datos.length > 0) {
      html += '<h3>Datos Detallados</h3><table border="1"><thead><tr>';
      const headers = Object.keys(this.vistaPrevia.datos[0]);
      headers.forEach(h => {
        html += `<th>${h}</th>`;
      });
      html += '</tr></thead><tbody>';

      this.vistaPrevia.datos.forEach(row => {
        html += '<tr>';
        headers.forEach(h => {
          html += `<td>${(row as any)[h]}</td>`;
        });
        html += '</tr>';
      });

      html += '</tbody></table>';
    }

    html += '</body></html>';

    this.descargarArchivo(html, `reporte_${this.config.tipo}_${new Date().getTime()}.xls`, 'application/vnd.ms-excel');
  }

  private exportarPDF() {
    if (!this.vistaPrevia) return;

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #1f5f87; border-bottom: 2px solid #1f5f87; padding-bottom: 10px; }
          h3 { color: #333; margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background-color: #1f5f87; color: white; padding: 10px; text-align: left; }
          td { border: 1px solid #ddd; padding: 8px; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .fecha { color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>${this.vistaPrevia.titulo}</h1>
        <p><strong>${this.vistaPrevia.descripcion}</strong></p>
        <p class="fecha">Generado: ${new Date().toLocaleString('es-CO')}</p>
    `;

    // Resumen
    if (this.vistaPrevia.resumen && Object.keys(this.vistaPrevia.resumen).length > 0) {
      html += '<h3>Resumen</h3>';
      html += '<table><tr><th>Métrica</th><th>Valor</th></tr>';
      Object.entries(this.vistaPrevia.resumen).forEach(([key, value]) => {
        html += `<tr><td>${this.formatearLabel(key)}</td><td><strong>${value}</strong></td></tr>`;
      });
      html += '</table>';
    }

    // Datos
    if (this.vistaPrevia.datos.length > 0) {
      html += '<h3>Datos Detallados</h3>';
      html += '<table><thead><tr>';
      const headers = Object.keys(this.vistaPrevia.datos[0]);
      headers.forEach(h => {
        html += `<th>${h}</th>`;
      });
      html += '</tr></thead><tbody>';

      this.vistaPrevia.datos.forEach(row => {
        html += '<tr>';
        headers.forEach(h => {
          const valor = (row as any)[h];
          html += `<td>${valor !== null && valor !== undefined ? valor : '-'}</td>`;
        });
        html += '</tr>';
      });

      html += '</tbody></table>';
    }

    html += '</body></html>';

    const ventana = window.open('', '_blank');
    if (ventana) {
      ventana.document.write(html);
      ventana.document.close();
      
      ventana.onload = () => {
        ventana.print();
      };
    }
  }

  private descargarArchivo(contenido: string | Blob, nombreArchivo: string, tipo?: string) {
    let blob: Blob;

    if (typeof contenido === 'string') {
      blob = new Blob([contenido], { type: tipo || 'text/plain' });
    } else {
      blob = contenido;
    }

    const url = window.URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    window.URL.revokeObjectURL(url);
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
      'promedioOcupacion': 'Ocupación Promedio (%)',
      'ingresosTotales': 'Ingresos Totales ($)',
      'cuentasPagadas': 'Cuentas Pagadas',
      'cuentasPendientes': 'Cuentas Pendientes',
      'totalClientes': 'Total Clientes',
      'gastoPromedio': 'Gasto Promedio ($)',
      'reservasActivas': 'Reservas Activas',
      'reservasConfirmadas': 'Reservas Confirmadas',
      'totalServicios': 'Total Servicios Solicitados',
      'ingresosServicios': 'Ingresos por Servicios ($)',
      'tiposServicios': 'Tipos de Servicios Diferentes'
    };
    return labels[keyStr] || keyStr;
  }

  formatearValor(value: any): string {
    if (typeof value === 'number') {
      if (value > 1000) {
        return '$' + value.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      }
      return value.toString();
    }
    return value;
  }
}