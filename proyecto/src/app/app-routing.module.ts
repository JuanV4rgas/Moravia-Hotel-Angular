import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home/home-page/home-page.component';  
import { ServiceTableComponent } from './service/service-table/service-table.component';
import {HabitacionTableComponent} from './habitacion/habitacion-table/habitacion-table.component'
import {RoomTableComponent} from './room/room-table/room-table.component'

const routes: Routes = [
  //definimos rutas
  { path: '', component: HomePageComponent },//Importamos el comonente del main
  { path: 'Service-Table', component: ServiceTableComponent },//Importamos el comonente del detalle del servicio
  { path: 'Habitacion-Table', component: HabitacionTableComponent },//Importamos el comonente del detalle de la habitacion
  { path: 'Room-Table', component: RoomTableComponent },//Importamos el comonente del detalle de la habitacion
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  
})
export class AppRoutingModule { }
