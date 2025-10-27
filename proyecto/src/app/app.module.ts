import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceTableComponent } from './servicio/service-table/service-table.component';
import { ServiceDetailComponent } from './servicio/servicio-detail/service-detail.component';
import { ServiceFormComponent } from './servicio/service-form/service-form.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './home/hero/hero.component';
import { RestaurantComponent } from './home/restaurant/restaurant.component';
import { SuitesComponent } from './home/suites/suites.component';
import { CardsCarouselComponent } from './home/cards-carousel/cards-carousel.component';
import { MediaRowComponent } from './home/media-row/media-row.component';
import { HamburgerComponent } from './components/hamburger/hamburger.component';
import { UserDropdownComponent } from './components/user-dropdown/user-dropdown.component';
import { RoomTableComponent } from './room/room-table/room-table.component';
import { RoomDetailComponent } from './room/room-detail/room-detail.component';
import { RoomFormComponent } from './room/room-form/room-form.component';
import { ClienteTableComponent } from './cliente/cliente-table/cliente-table.component';
import { ClienteDetailComponent } from './cliente/cliente-detail/cliente-detail.component';
import { ClienteFormComponent } from './cliente/cliente-form/cliente-form.component';
import { AuthWrapComponent } from './auth/auth-wrap/auth-wrap.component';
import { AuthCardComponent } from './auth/auth-card/auth-card.component';
import { LoginFormComponent } from './auth/login-form/login-form.component';
import { RegisterFormComponent } from './auth/register-form/register-form.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { RoomTypeFormComponent } from './roomtype/roomtype-form/roomtype-form.component';
import { RoomTypeDetailComponent } from './roomtype/room_type-detail/roomtype-detail.component';
import { HistoriaComponent } from './historia/historia.component';
import { ServiceListComponent } from './servicio/service-list/service-list.component';
import { RoomtypeListComponent } from './roomtype/roomtype-list/roomtype-list.component';
import { ProfileHeaderComponent } from './user/profile-header/profile-header.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ProfileFormComponent } from './user/profile-form/profile-form.component';
import { UsuarioTableComponent } from './usuario/usuario-table/usuario-table.component';
import { UsuarioDetailComponent } from './usuario/usuario-detail/usuario-detail.component';
import { UsuarioFormComponent } from './usuario/usuario-form/usuario-form.component';
import { RoomtypeEditarComponent } from './roomtype/roomtype-editar/roomtype-editar.component';
import { RoomEditarComponent } from './room/room-editar/room-editar.component';
import { ServiceEditarComponent } from './servicio/service-editar/service-editar.component';
import { ReservaFormComponent } from './reserva/reserva-form/reserva-form.component';
import { RoomSelectorComponent } from './reserva/room-selector/room-selector.component';
import { RoomTypeSelectorComponent } from './reserva/room-type-selector/room-type-selector.component';
import { MisReservasComponent } from './reserva/mis-reservas/mis-reservas.component';
import { DetalleReservaComponent } from './reserva/detalle-reserva/detalle-reserva.component';
import { AgregarServiciosComponent } from './reserva/agregar-servicios/agregar-servicios.component';
import { ConsultarComponent } from './consultar/consultar.component';
import { ReservaTableComponent } from './reserva/reserva-table/reserva-table.component';
import { GestionarServiciosComponent } from './reserva/gestionar-servicios/gestionar-servicios.component';
import { EditarReservaComponent } from './reserva/editar-reserva/editar-reserva.component';
import { PortalLayoutComponent } from './layouts/portal-layout/portal-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    //ServiceTableComponent,
    //ServiceDetailComponent,
    //ServiceFormComponent,
    HomePageComponent,
    FooterComponent,
    HeaderComponent,
    HeroComponent,
    RestaurantComponent,
    SuitesComponent,
    CardsCarouselComponent,
    MediaRowComponent,
    HamburgerComponent,
    UserDropdownComponent,
    //RoomTableComponent,
    //RoomDetailComponent,
    RoomFormComponent,
    RoomTypeFormComponent,
    //RoomTypeDetailComponent,
    ClienteTableComponent,
    ClienteDetailComponent,
    ClienteFormComponent,
    AuthWrapComponent,
    AuthCardComponent,
    LoginFormComponent,
    RegisterFormComponent,
    MainLayoutComponent,
    AuthLayoutComponent,
    HistoriaComponent,
    ServiceListComponent,
    RoomtypeListComponent,
    ProfileHeaderComponent,
    ProfileComponent,
    ProfileFormComponent,
    //UsuarioTableComponent,
    UsuarioDetailComponent,
    UsuarioFormComponent,
    RoomtypeEditarComponent,
    //RoomEditarComponent,
    ReservaFormComponent,
    RoomSelectorComponent,
    RoomTypeSelectorComponent,
    MisReservasComponent,
    DetalleReservaComponent,
    AgregarServiciosComponent,
    ConsultarComponent,
    ReservaTableComponent,
    GestionarServiciosComponent,
    //ServiceEditarComponent,
    RoomtypeListComponent,
    EditarReservaComponent,
    PortalLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
