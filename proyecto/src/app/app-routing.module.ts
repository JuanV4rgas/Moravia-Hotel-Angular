import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home/home-page/home-page.component';
import { ServiceTableComponent } from './servicio/service-table/service-table.component';
import { ServiceDetailComponent } from './servicio/servicio-detail/service-detail.component';
import { ServiceFormComponent } from './servicio/service-form/service-form.component';
import { ServiceEditarComponent } from './servicio/service-editar/service-editar.component';
import { ServiceListComponent } from './servicio/service-list/service-list.component';
import { RoomTableComponent } from './room/room-table/room-table.component';
import { RoomFormComponent } from './room/room-form/room-form.component';
import { RoomDetailComponent } from './room/room-detail/room-detail.component';
import { ClienteTableComponent } from './cliente/cliente-table/cliente-table.component';
import { ClienteFormComponent } from './cliente/cliente-form/cliente-form.component';
import { ClienteDetailComponent } from './cliente/cliente-detail/cliente-detail.component';
import { AuthWrapComponent } from './auth/auth-wrap/auth-wrap.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { RoomTypeTableComponent } from './roomtype/roomtype-table/roomtype-table.component';
import { RoomTypeFormComponent } from './roomtype/roomtype-form/roomtype-form.component';
import { RoomTypeDetailComponent } from './roomtype/room_type-detail/roomtype-detail.component';
import { RoomtypeListComponent } from './roomtype/roomtype-list/roomtype-list.component';
import { ProfileHeaderComponent } from './user/profile-header/profile-header.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ProfileFormComponent } from './user/profile-form/profile-form.component';
import { UsuarioFormComponent } from './usuario/usuario-form/usuario-form.component';
import { UsuarioTableComponent } from './usuario/usuario-table/usuario-table.component';
import { UsuarioDetailComponent } from './usuario/usuario-detail/usuario-detail.component';
import { HistoriaComponent } from './historia/historia.component';
import { ReservaFormComponent } from './reserva/reserva-form/reserva-form.component';
import { MisReservasComponent } from './reserva/mis-reservas/mis-reservas.component';
import { DetalleReservaComponent } from './reserva/detalle-reserva/detalle-reserva.component';
import { RoomEditarComponent } from './room/room-editar/room-editar.component';
import { ConsultarComponent } from './consultar/consultar.component';
import { ReservaTableComponent } from './reserva/reserva-table/reserva-table.component';
import { GestionarServiciosComponent } from './reserva/gestionar-servicios/gestionar-servicios.component';
import { EditarReservaComponent } from './reserva/editar-reserva/editar-reserva.component';
import { authGuard, roleGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomePageComponent },

      // Rutas de SERVICIO - Solo trabajadores (excepto lista que es pública)
      {
        path: 'servicio/table',
        component: ServiceTableComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },
      { path: 'servicio/detail/:id', component: ServiceDetailComponent },
      {
        path: 'servicio/nuevo',
        component: ServiceFormComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },
      { path: 'servicio/lista', component: ServiceListComponent },
      {
        path: 'servicio/editar/:id',
        component: ServiceEditarComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },

      // Rutas de ROOM - Solo trabajadores
      {
        path: 'room/table',
        component: RoomTableComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },
      {
        path: 'room/nuevo',
        component: RoomFormComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },
      { path: 'room/detail/:id', component: RoomDetailComponent },
      {
        path: 'room/editar/:id',
        component: RoomEditarComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },

      // Rutas de CLIENTE - Solo trabajadores
      {
        path: 'cliente/table',
        component: ClienteTableComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },
      {
        path: 'cliente/nuevo',
        component: ClienteFormComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },
      {
        path: 'cliente/detail/:id',
        component: ClienteDetailComponent,
        canActivate: [authGuard],
      },

      // Rutas de ROOMTYPE - Solo trabajadores (excepto lista que es pública)
      {
        path: 'roomtype/table',
        component: RoomTypeTableComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },
      { path: 'roomtype/lista', component: RoomtypeListComponent },
      {
        path: 'roomtype/nuevo',
        component: RoomTypeFormComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },
      { path: 'roomtype/detail/:id', component: RoomTypeDetailComponent },
      {
        path: 'roomtype/editar/:id',
        component: RoomTypeFormComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },

      // Rutas de PERFIL - Requiere autenticación
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard],
      },

      // Historia - Pública
      { path: 'historia', component: HistoriaComponent },

      // Rutas de RESERVA
      // reserva/nuevo - Solo CLIENTES (excepción a las rutas de trabajador)
      {
        path: 'reserva/nuevo',
        component: ReservaFormComponent,
        canActivate: [authGuard, roleGuard('cliente')],
      },
      // mis-reservas - Solo CLIENTES
      {
        path: 'mis-reservas',
        component: MisReservasComponent,
        canActivate: [authGuard, roleGuard('cliente')],
      },
      // Detalle de reserva - Requiere autenticación
      {
        path: 'reserva/detalle/:id',
        component: DetalleReservaComponent,
        canActivate: [authGuard],
      },
      // Editar reserva - Solo trabajadores
      {
        path: 'reserva/editar/:id',
        component: EditarReservaComponent,
        canActivate: [authGuard],
      },
      // Tabla de reservas - Solo trabajadores
      {
        path: 'reserva/table',
        component: ReservaTableComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },
      // Gestionar servicios - Solo trabajadores
      {
        path: 'reserva/servicios/:id',
        component: GestionarServiciosComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },

      // Rutas de USUARIO - Solo trabajadores
      {
        path: 'usuario/table',
        component: UsuarioTableComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },
      {
        path: 'usuario/detalle/:id',
        component: UsuarioDetailComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },
      {
        path: 'usuario/nuevo',
        component: UsuarioFormComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },

      // Ruta CONSULTAR - Solo trabajadores
      {
        path: 'consultar',
        component: ConsultarComponent,
        canActivate: [authGuard, roleGuard('trabajador')],
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [{ path: '', component: AuthWrapComponent }],
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
