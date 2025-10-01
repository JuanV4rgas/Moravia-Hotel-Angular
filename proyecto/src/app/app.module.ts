import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceTableComponent } from './service/service-table/service-table.component';
import { ServiceDetailComponent } from './service/service-detail/service-detail.component';
import { ServiceFormComponent } from './service/service-form/service-form.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LandingComponent } from './components/landing/landing.component';
import { RoomTableComponent } from './room/room-table/room-table.component';
import { RoomDetailComponent } from './room/room-detail/room-detail.component';
import { RoomFormComponent } from './room/room-form/room-form.component';
import { HabitacionTableComponent } from './habitacion/habitacion-table/habitacion-table.component';
import { HabitacionDetailComponent } from './habitacion/habitacion-detail/habitacion-detail.component';
import { HabitacionFormComponent } from './habitacion/habitacion-form/habitacion-form.component';
import { ClienteTableComponent } from './cliente/cliente-table/cliente-table.component';
import { ClienteDetailComponent } from './cliente/cliente-detail/cliente-detail.component';
import { ClienteFormComponent } from './cliente/cliente-form/cliente-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ServiceTableComponent,
    ServiceDetailComponent,
    ServiceFormComponent,
    HomePageComponent,
    FooterComponent,
    HeaderComponent,
    LandingComponent,
    RoomTableComponent,
    RoomDetailComponent,
    RoomFormComponent,
    HabitacionTableComponent,
    HabitacionDetailComponent,
    HabitacionFormComponent,
    ClienteTableComponent,
    ClienteDetailComponent,
    ClienteFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
