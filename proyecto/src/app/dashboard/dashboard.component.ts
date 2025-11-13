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
import Chart from 'chart.js/auto';

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

      // Vincular cuentas a reservas
      this.reservas.forEach(r => {
        r.cuenta = this.cuentas.find(c => c.id === r.id) as any;
      });

      console.log('✓ Datos cargados:', {
        reservas: this.reservas.length,
        cuentas: this.cuentas.length,
        servicios: this.servicios.length,
        usuarios: this.usuarios.length,
        habitaciones: this.habitaciones.length
      });

      this.calcularMetricas();
      this.calcularServiciosTop();
      this.crearGraficos();

      this.isLoading = false;
    }).catch(error => {
      console.error('✗ Error al cargar datos:', error);
      this.errorMessage = `Error al cargar los datos del dashboard: ${error?.message || 'Error desconocido'}`;
      this.isLoading = false;
    });
  }

  calcularMetricas() {
    const fechaFiltro = this.obtenerFechaFiltro();

    // Calcular ocupación
    const habitacionesOcupadas = this.reservas.filter(r => 
      (r.estado === 'ACTIVA' || r.estado === 'CONFIRMADA') && new Date(r.fechaInicio) >= fechaFiltro
    ).length;
    this.metricas.ocupacion = this.habitaciones.length > 0 
      ? Math.round((habitacionesOcupadas / this.habitaciones.length) * 100)
      : 0;

    // Calcular ingresos (lo pagado hasta el momento)
    this.metricas.ingresos = this.cuentas
      .reduce((sum, c) => sum + (c.saldo || 0), 0);

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
    console.log('📊 Creando gráficos...');
    
    // Verificar disponibilidad de Chart
    const chartAvailable = typeof Chart !== 'undefined';
    console.log('✓ Chart disponible en global:', chartAvailable);
    console.log('✓ Chart desde import:', typeof (Chart as any));
    
    // Verificar canvas elementos
    const canvases = {
      ocupacion: document.getElementById('chartOcupacion'),
      ingresos: document.getElementById('chartIngresos'),
      tipo: document.getElementById('chartTipoHabitacion'),
      estado: document.getElementById('chartEstadoReservas')
    };
    
    console.log('✓ Canvas elementos encontrados:', {
      ocupacion: !!canvases.ocupacion,
      ingresos: !!canvases.ingresos,
      tipo: !!canvases.tipo,
      estado: !!canvases.estado
    });
    
    setTimeout(() => {
      console.log('  Creando gráfico de ocupación...');
      this.crearGraficoOcupacion();
      
      console.log('  Creando gráfico de ingresos...');
      this.crearGraficoIngresos();
      
      console.log('  Creando gráfico de tipo habitación...');
      this.crearGraficoTipoHabitacion();
      
      console.log('  Creando gráfico de estado reservas...');
      this.crearGraficoEstadoReservas();
      
      console.log('✓ Gráficos creados exitosamente');
    }, 100);
  }

  crearGraficoOcupacion() {
    try {
      const canvas = document.getElementById('chartOcupacion') as HTMLCanvasElement;
      if (!canvas) {
        console.error('✗ Canvas chartOcupacion no encontrado');
        return;
      }

      // Obtener el contenedor padre y establecer dimensiones
      const container = canvas.parentElement as HTMLElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        console.log('📏 Canvas chartOcupacion dimensiones:', canvas.width, 'x', canvas.height);
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('✗ No se pudo obtener contexto 2D de chartOcupacion');
        return;
      }

      const datos = this.obtenerDatosOcupacion();
      console.log('📈 Datos de ocupación:', datos);

      // Destruir gráfico anterior si existe
      if (this.chartOcupacion) {
        this.chartOcupacion.destroy();
        console.log('🔄 Gráfico anterior destruido');
      }

      console.log('📊 Creando nuevo gráfico de ocupación con Chart.js...');
      this.chartOcupacion = new Chart(ctx, {
        type: 'line',
        data: {
          labels: datos.labels,
          datasets: [{
            label: 'Ocupación (%)',
            data: datos.valores,
            borderColor: '#1f5f87',
            backgroundColor: 'rgba(31, 95, 135, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: '#1f5f87',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top' as const
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      } as any);
      console.log('✓ Gráfico de ocupación creado exitosamente');
    } catch (error) {
      console.error('✗ Error al crear gráfico de ocupación:', error);
    }
  }

  crearGraficoIngresos() {
    try {
      const canvas = document.getElementById('chartIngresos') as HTMLCanvasElement;
      if (!canvas) {
        console.error('✗ Canvas chartIngresos no encontrado');
        return;
      }

      // Obtener el contenedor padre y establecer dimensiones
      const container = canvas.parentElement as HTMLElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        console.log('📏 Canvas chartIngresos dimensiones:', canvas.width, 'x', canvas.height);
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('✗ No se pudo obtener contexto 2D de chartIngresos');
        return;
      }

      const datos = this.obtenerDatosIngresos();
      console.log('💰 Datos de ingresos:', datos);

      // Destruir gráfico anterior si existe
      if (this.chartIngresos) {
        this.chartIngresos.destroy();
        console.log('🔄 Gráfico anterior destruido');
      }

      console.log('📊 Creando nuevo gráfico de ingresos con Chart.js...');
      this.chartIngresos = new Chart(ctx, {
        type: 'line',
        data: {
          labels: datos.labels,
          datasets: [{
            label: 'Ingresos ($)',
            data: datos.valores,
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: '#28a745',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top' as const
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      } as any);
      console.log('✓ Gráfico de ingresos creado exitosamente');
    } catch (error) {
      console.error('✗ Error al crear gráfico de ingresos:', error);
    }
  }

  crearGraficoTipoHabitacion() {
    try {
      const canvas = document.getElementById('chartTipoHabitacion') as HTMLCanvasElement;
      if (!canvas) {
        console.error('✗ Canvas chartTipoHabitacion no encontrado');
        return;
      }

      // Obtener el contenedor padre y establecer dimensiones
      const container = canvas.parentElement as HTMLElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        console.log('📏 Canvas chartTipoHabitacion dimensiones:', canvas.width, 'x', canvas.height);
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('✗ No se pudo obtener contexto 2D de chartTipoHabitacion');
        return;
      }

      const datos = this.obtenerDatosTipoHabitacion();
      console.log('🏠 Datos de tipos de habitación:', datos);

      // Destruir gráfico anterior si existe
      if (this.chartTipoHabitacion) {
        this.chartTipoHabitacion.destroy();
        console.log('🔄 Gráfico anterior destruido');
      }

      console.log('📊 Creando nuevo gráfico de tipos de habitación con Chart.js...');
      this.chartTipoHabitacion = new Chart(ctx, {
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
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'right' as const
            }
          }
        }
      } as any);
      console.log('✓ Gráfico de tipos de habitación creado exitosamente');
    } catch (error) {
      console.error('✗ Error al crear gráfico de tipos de habitación:', error);
    }
  }

  crearGraficoEstadoReservas() {
    try {
      const canvas = document.getElementById('chartEstadoReservas') as HTMLCanvasElement;
      if (!canvas) {
        console.error('✗ Canvas chartEstadoReservas no encontrado');
        return;
      }

      // Obtener el contenedor padre y establecer dimensiones
      const container = canvas.parentElement as HTMLElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        console.log('📏 Canvas chartEstadoReservas dimensiones:', canvas.width, 'x', canvas.height);
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('✗ No se pudo obtener contexto 2D de chartEstadoReservas');
        return;
      }

      const datos = this.obtenerDatosEstadoReservas();
      console.log('📋 Datos de estados de reservas:', datos);

      // Destruir gráfico anterior si existe
      if (this.chartEstadoReservas) {
        this.chartEstadoReservas.destroy();
        console.log('🔄 Gráfico anterior destruido');
      }

      console.log('📊 Creando nuevo gráfico de estados de reservas con Chart.js...');
      this.chartEstadoReservas = new Chart(ctx, {
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
          responsive: false,
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
      } as any);
      console.log('✓ Gráfico de estados de reservas creado exitosamente');
    } catch (error) {
      console.error('✗ Error al crear gráfico de estados de reservas:', error);
    }
  }

  obtenerDatosOcupacion() {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const datosOcupacion: { [key: string]: number[] } = {};

    // Inicializar arreglos para cada mes
    meses.forEach(mes => {
      datosOcupacion[mes] = [0, 0]; // [totalDias, diasOcupados]
    });

    console.log('📊 Procesando', this.reservas.length, 'reservas para ocupación');

    // Procesar reservas para contar ocupación por mes
    this.reservas.forEach((reserva, idx) => {
      const inicio = new Date(reserva.fechaInicio);
      const fin = new Date(reserva.fechaFin);
      console.log(`  Reserva ${idx}: ${reserva.cliente?.nombre} - ${inicio.toLocaleDateString()} a ${fin.toLocaleDateString()} - Estado: ${reserva.estado}`);

      for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
        const mesIdx = d.getMonth();
        const mesKey = meses[mesIdx];
        datosOcupacion[mesKey][0]++; // incrementar total de días en mes
        if (reserva.estado === 'ACTIVA' || reserva.estado === 'CONFIRMADA') {
          datosOcupacion[mesKey][1]++; // incrementar días ocupados
        }
      }
    });

    const valores = meses.slice(0, 6).map(mes => {
      const [totalDias, diasOcupados] = datosOcupacion[mes];
      return totalDias > 0 ? Math.round((diasOcupados / (totalDias / this.habitaciones.length)) * 100) : 0;
    });

    console.log('  Ocupación por mes:', meses.slice(0, 6), valores);

    return {
      labels: meses.slice(0, 6),
      valores: valores.map(v => Math.min(v, 100)) // Limitar a 100%
    };
  }

  obtenerDatosIngresos() {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const datosIngresos: { [key: string]: number } = {};

    // Inicializar ingresos por mes en 0
    meses.forEach(mes => {
      datosIngresos[mes] = 0;
    });

    console.log('💰 Procesando', this.cuentas.length, 'cuentas para ingresos');

    // Sumar ingresos pagados por mes (incluyendo pagos parciales de cuentas abiertas)
    this.cuentas
      .forEach((cuenta, idx) => {
        if (cuenta.reserva && cuenta.reserva.fechaInicio) {
          const mesIdx = new Date(cuenta.reserva.fechaInicio).getMonth();
          const mesKey = meses[mesIdx];
          console.log(`  Cuenta ${idx}: ${mesKey} - $${cuenta.saldo} pagado (Estado: ${cuenta.estado})`);
          datosIngresos[mesKey] += cuenta.saldo || 0;
        }
      });

    const valores = meses.slice(0, 6).map(mes => datosIngresos[mes]);

    console.log('  Ingresos por mes:', meses.slice(0, 6), valores);

    return { labels: meses.slice(0, 6), valores };
  }

  obtenerDatosTipoHabitacion() {
    const tipoMap = new Map<string, number>();

    console.log('🏠 Procesando tipos de habitación de', this.reservas.length, 'reservas');

    this.reservas.forEach(reserva => {
      reserva.rooms.forEach(room => {
        const tipo = room.type?.name || 'Desconocido';
        tipoMap.set(tipo, (tipoMap.get(tipo) || 0) + 1);
      });
    });

    const labels = Array.from(tipoMap.keys());
    const valores = Array.from(tipoMap.values());
    console.log('  Tipos encontrados:', labels, valores);

    return {
      labels,
      valores
    };
  }

  obtenerDatosEstadoReservas() {
    const estadoMap = new Map<string, number>();

    console.log('📋 Procesando estados de', this.reservas.length, 'reservas');

    this.reservas.forEach(reserva => {
      const estado = reserva.estado || 'DESCONOCIDO';
      estadoMap.set(estado, (estadoMap.get(estado) || 0) + 1);
    });

    const labels = Array.from(estadoMap.keys());
    const valores = Array.from(estadoMap.values());
    console.log('  Estados encontrados:', labels, valores);

    return {
      labels,
      valores
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