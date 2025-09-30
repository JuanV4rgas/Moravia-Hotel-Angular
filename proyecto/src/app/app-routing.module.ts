import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home/home-page/home-page.component';  
import { ServiceTableComponent } from './service/service-table/service-table.component';
import { HabitacionTableComponent } from './habitacion/habitacion-table/habitacion-table.component'
import { RoomTableComponent } from './room/room-table/room-table.component'

const routes: Routes = [
  //definimos rutas
  { path: 'servicio/table', component: ServiceTableComponent },//Importamos el comonente del detalle del servicio
  { path: 'habitacion/table', component: HabitacionTableComponent },//Importamos el comonente del detalle de la habitacion
  { path: 'room/table', component: RoomTableComponent },//Importamos el comonente del detalle de la habitacion
  { path: '**', redirectTo: '' },
    { path: '', component: HomePageComponent },//Importamos el comonente del main

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
