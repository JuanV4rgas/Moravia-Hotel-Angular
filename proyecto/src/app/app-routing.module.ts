import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home/home-page/home-page.component';
import { ServiceTableComponent } from './servicio/service-table/service-table.component';
import { HabitacionTableComponent } from './habitacion/habitacion-table/habitacion-table.component';
import { RoomTableComponent } from './room/room-table/room-table.component';
import { ClienteTableComponent } from './cliente/cliente-table/cliente-table.component';
import { HabitacionDetailComponent } from './habitacion/habitacion-detail/habitacion-detail.component';
import { HabitacionFormComponent } from './habitacion/habitacion-form/habitacion-form.component';


const routes: Routes = [
  //definimos rutas
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'servicio/table', component: ServiceTableComponent },//Importamos el comonente del detalle del servicio
  { path: 'habitacion/table', component: HabitacionTableComponent },//Importamos el comonente del detalle de la habitacion
  { path: 'room/table', component: RoomTableComponent },//Importamos el comonente del detalle de la habitacion
  { path: 'cliente/table', component: ClienteTableComponent },
  { path: 'habitaciones', component: HabitacionTableComponent },
  { path: 'habitaciones/:id', component: HabitacionDetailComponent },
  { path: 'habitaciones/nueva', component: HabitacionFormComponent },
  { path: '**', redirectTo: 'home' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
