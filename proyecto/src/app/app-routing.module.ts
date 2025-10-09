import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home/home-page/home-page.component';
import { ServiceTableComponent } from './servicio/service-table/service-table.component';
import { ServiceDetailComponent } from './servicio/servicio-detail/service-detail.component';
import { ServiceFormComponent } from './servicio/service-form/service-form.component';
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

import { UsuarioFormComponent } from './usuario/usuario-form/usuario-form.component';
import { UsuarioTableComponent } from './usuario/usuario-table/usuario-table.component';
import { UsuarioDetailComponent } from './usuario/usuario-detail/usuario-detail.component';



const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomePageComponent },
      { path: 'servicio/table', component: ServiceTableComponent },
      { path: 'servicio/detail', component: ServiceDetailComponent },
      { path: 'servicio/nueva', component: ServiceFormComponent },
      { path: 'servicio/lista', component: ServiceListComponent },
      { path: 'room/table', component: RoomTableComponent },
      { path: 'room/nueva', component: RoomFormComponent },
      { path: 'room/detail/:id', component: RoomDetailComponent },
      { path: 'cliente/table', component: ClienteTableComponent },
      { path: 'cliente/nueva', component: ClienteFormComponent },
      { path: 'cliente/detail', component: ClienteDetailComponent },
      { path: 'roomtype/table', component: RoomTypeTableComponent },
      { path: 'roomtype/lista', component: RoomtypeListComponent },
      { path: 'roomtype/nueva', component: RoomTypeFormComponent },
      { path: 'roomtype/detail', component: RoomTypeDetailComponent },

      { path: 'usuario/table', component: UsuarioTableComponent },
      { path: 'usuario/detalle/:id', component: UsuarioDetailComponent },
      { path: 'usuario/nuevo', component: UsuarioFormComponent },
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
