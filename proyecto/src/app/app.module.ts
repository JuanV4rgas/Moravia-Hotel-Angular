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
import { HeroComponent } from './home/hero/hero.component';
import { RestaurantComponent } from './home/restaurant/restaurant.component';
import { SuitesComponent } from './home/suites/suites.component';
import { CardsCarouselComponent } from './home/cards-carousel/cards-carousel.component';
import { MediaRowComponent } from './home/media-row/media-row.component';

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
