import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home/home-page/home-page.component';
import { ServiceTableComponent } from './servicio/service-table/service-table.component';
import { HabitacionTableComponent } from './roomtype/roomtype-table/roomtype-table.component';
import { RoomTableComponent } from './room/room-table/room-table.component';
import { ClienteTableComponent } from './cliente/cliente-table/cliente-table.component';
import { HabitacionDetailComponent } from './roomtype/room_type-detail/roomtype-detail.component';
import { HabitacionFormComponent } from './roomtype/roomtype-form/roomtype-form.component';
import { AuthWrapComponent } from './auth/auth-wrap/auth-wrap.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomePageComponent },
      { path: 'servicio/table', component: ServiceTableComponent },
      { path: 'habitacion/table', component: HabitacionTableComponent },
      { path: 'room/table', component: RoomTableComponent },
      { path: 'cliente/table', component: ClienteTableComponent },
      { path: 'habitaciones', component: HabitacionTableComponent },
      { path: 'habitaciones/nueva', component: HabitacionFormComponent }, // ← ANTES de :id
      { path: 'habitaciones/:id', component: HabitacionDetailComponent },
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
