import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { HabitacionTableComponent } from './roomtype/roomtype-table/roomtype-table.component';
import { HabitacionDetailComponent } from './roomtype/room_type-detail/roomtype-detail.component';
import { HabitacionFormComponent } from './roomtype/roomtype-form/roomtype-form.component';
import { ClienteTableComponent } from './cliente/cliente-table/cliente-table.component';
import { ClienteDetailComponent } from './cliente/cliente-detail/cliente-detail.component';
import { ClienteFormComponent } from './cliente/cliente-form/cliente-form.component';
import { AuthWrapComponent } from './auth/auth-wrap/auth-wrap.component';
import { AuthCardComponent } from './auth/auth-card/auth-card.component';
import { LoginFormComponent } from './auth/login-form/login-form.component';
import { RegisterFormComponent } from './auth/register-form/register-form.component';
import { HttpClientModule } from '@angular/common/http';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    ServiceTableComponent,
    ServiceDetailComponent,
    ServiceFormComponent,
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
    RoomTableComponent,
    RoomDetailComponent,
    RoomFormComponent,
    HabitacionTableComponent,
    HabitacionDetailComponent,
    HabitacionFormComponent,
    ClienteTableComponent,
    ClienteDetailComponent,
    ClienteFormComponent,
    AuthWrapComponent,
    AuthCardComponent,
    LoginFormComponent,
    RegisterFormComponent,
    MainLayoutComponent,
    AuthLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
