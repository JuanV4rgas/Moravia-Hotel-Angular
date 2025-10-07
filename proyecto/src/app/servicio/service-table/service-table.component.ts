import { Component } from '@angular/core';
import { Service } from '../service';

@Component({
  selector: 'app-service-table',
  templateUrl: './service-table.component.html',
  styleUrls: ['./service-table.component.css']
})
export class ServiceTableComponent {


  //Atributos 
selectedService!: Service;

  //Base de datos
  servicesList: Service[] = [
  {
    id: 1,
    name: "Restaurante Michelin 3 Estrellas",
    price: 295,
    description: "Experiencia gastronómica excepcional en uno de los comedores más prestigiosos del mundo, con menú degustación de cocina checa contemporánea y vinos seleccionados.",
    image: "https://cldnr.prod.webx.talpa.digital/talpa-network/image/fetch/f_auto,c_limit,w_3840,q_auto/https://images.ctfassets.net/mwdlh7x5m54h/72sO8UnNUwLASrqMK86d3x/bb012a3c1006d7daa6d6ca8bf0fb2690/pexels-cottonbro-6466288.jpg"
  },
  {
    id: 2,
    name: "Spa Royal Bohemia",
    price: 180,
    description: "Centro de bienestar de lujo con tratamientos exclusivos, sauna finlandesa, baño turco y piscina climatizada con vistas al Castillo de Praga.",
    image: "https://images.pexels.com/photos/6560304/pexels-photo-6560304.jpeg"
  },
  {
    id: 3,
    name: "Bar Kompot Legendario",
    price: 35,
    description: "Bar exclusivo famoso por su ambiente nocturno elegante, cócteles artesanales y el legendario kompot de la casa con vista panorámica de Malá Strana.",
    image: "https://offloadmedia.feverup.com/secretsanfrancisco.com/wp-content/uploads/2023/02/13023230/68693037_151390299393573_6890019703301565669_n-2-1024x683.jpg"
  },
  {
    id: 4,
    name: "Cafetería Imperial",
    price: 13,
    description: "Cafetería de ambiente refinado que sirve café de especialidad, pasteles artesanales y té de las mejores plantaciones del mundo en un entorno histórico.",
    image: "https://swiss-historic-hotels.ch/bilder/hotels/grandhotel-giessbach/_AUTOxAUTO_crop_center-center_none/portrait-grandhotel-giessbach-brienz-swiss-historic-hotels-02.jpg"
  },
  {
    id: 5,
    name: "Piscina Infinity Castillo",
    price: 45,
    description: "Piscina climatizada tipo infinity con vista directa a nuestro castillo, área de relajación y servicio de toallas premium.",
    image: "https://giessbach.ch/images/image_uploads/GrandhotelGiessbach_%C2%A9DigitaleMassarbeit_503.jpg"
  },
  {
    id: 6,
    name: "Servicio de Conserjería Premium",
    price: 125,
    description: "Conserjería 24/7 especializada en experiencias exclusivas: reservas en restaurantes, entradas VIP a eventos, tours privados por Praga y servicios personalizados.",
    image: "https://guianzalibre.com/wp-content/uploads/2023/12/Agente-de-Viajes-1-1024x819.png"
  },
  {
    id: 7,
    name: "Servicio de Habitaciones 24h",
    price: 85,
    description: "Servicio de habitaciones disponible las 24 horas con menú gourmet, champagne y delicatessen locales servidos con elegancia en vajilla de porcelana.",
    image: "https://media.gq.com.mx/photos/6155f165f3951529d43a0743/16:9/w_2991,h_1682,c_limit/GettyImages-56807633-lo-que-no-debes-pedir-de-room-service.jpg"
  },
  {
    id: 8,
    name: "Servicio de Mayordomo Personal",
    price: 120,
    description: "Mayordomo personal dedicado para suites de lujo, disponible para desempaque, planchado, reservas y atención personalizada durante toda la estancia.",
    image: "https://poloandtweed.com/wp-content/uploads/2023/02/Blog-Photos-5.png"
  },
  {
    id: 9,
    name: "Traslados Privados de Lujo",
    price: 85,
    description: "Servicio de traslado en vehículos de lujo (Mercedes-Benz Clase S, BMW Serie 7) desde/hacia aeropuerto y tours privados por la ciudad.",
    image: "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/09/5b/57/2a.jpg"
  },
  {
    id: 10,
    name: "Salones para Eventos Privados",
    price: 5000,
    description: "Espacios elegantes para eventos corporativos y celebraciones privadas con capacidad de 20-150 personas, incluye catering gourmet y coordinación completa.",
    image: "https://media-cdn.tripadvisor.com/media/photo-s/07/c5/bc/b0/grandhotel-giessbach.jpg"
  },

];

  mostrarServicio(service:Service){
    this.selectedService= service;
  }

  agregarServicio(service:Service){
    this.servicesList.push(service);
  }

  eliminarServicio(service:Service){
    var index = this.servicesList.indexOf(service);
    this.servicesList.splice(index,1);
  }

}
