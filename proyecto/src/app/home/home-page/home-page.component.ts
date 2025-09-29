import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';

// Interfaces para los datos
interface Habitacion { 
  id: string; 
  nombre: string; 
  precio: number; 
  foto: string; 
  descripcion?: string; 
  capacidad?: string; 
  numeroCamas?: number; 
  tipo?: string; 
}

interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  foto: string;
  categoria: string;
}



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, AfterViewInit {
  year = new Date().getFullYear();
  habitaciones: Habitacion[] = [];
  servicios: Servicio[] = [];

  // ViewChild references para el carrusel de servicios
  @ViewChild('ccTrack', { static: false }) ccTrack?: ElementRef<HTMLDivElement>;
  @ViewChild('ccPrev', { static: false }) ccPrev?: ElementRef<HTMLButtonElement>;
  @ViewChild('ccNext', { static: false }) ccNext?: ElementRef<HTMLButtonElement>;

  ngOnInit() {
    // Cargar datos mock
    this.habitaciones = MOCK_HABITACIONES;
    this.servicios = MOCK_SERVICIOS;
  }

  ngAfterViewInit(): void {
    // Configurar carrusel de servicios
    this.setupServicesCarousel();
  }

  private setupServicesCarousel(): void {
    const track = this.ccTrack?.nativeElement;
    const prevBtn = this.ccPrev?.nativeElement;
    const nextBtn = this.ccNext?.nativeElement;

    if (!track || !prevBtn || !nextBtn) return;

    const scrollAmount = 190 + 16; // Ancho tarjeta + gap

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // Método para obtener el enlace del servicio
  getServiceLink(serviceId: string): string {
    return `/servicios/${serviceId}`;
  }

  // Método para obtener el enlace de la habitación
  getRoomLink(roomId: string): string {
    return `/habitaciones/${roomId}`;
  }
}

// Datos mock de habitaciones
const MOCK_HABITACIONES: Habitacion[] = [
  {
    id: 'HAB001',
    nombre: 'Suite Presidencial Castillo',
    precio: 1850,
    foto: 'https://giessbach.ch/images/image_uploads/GrandhotelGiessbach_%C2%A9DigitaleMassarbeit_269.jpg',
    descripcion: 'Suite de lujo con vistas panorámicas al Castillo de Praga, jacuzzi privado, sala de estar amplia y servicio de mayordomo personal.',
    capacidad: '2 adultos + 1 niño',
    numeroCamas: 1,
    tipo: 'Suite'
  },
  {
    id: 'HAB002',
    nombre: 'Suite Real Bohemia',
    precio: 1350,
    foto: 'https://giessbach.ch/images/image_uploads/224_Weber-Suite-Wohnzimmer.jpg',
    descripcion: 'Habitación espaciosa decorada con estilo clásico bohemio, chimenea de mármol y terraza privada con vistas al río Moldava.',
    capacidad: '2 adultos',
    numeroCamas: 1,
    tipo: 'Suite'
  },
  {
    id: 'HAB003',
    nombre: 'Junior Suite Imperial',
    precio: 890,
    foto: 'https://giessbach.ch/images/image_uploads/Suite-Horace-Edouard-Zimmer.jpg',
    descripcion: 'Suite elegante con sala de estar separada, baño de mármol con bañera profunda y decoración contemporánea de lujo.',
    capacidad: '2 adultos + 1 niño',
    numeroCamas: 1,
    tipo: 'Suite'
  },
  {
    id: 'HAB004',
    nombre: 'Habitación Deluxe Panorámica',
    precio: 520,
    foto: 'https://giessbach.ch/images/image_uploads/_zimmer/Suite-von-Rappard-Wohnecke.jpg',
    descripcion: 'Habitación moderna con ventanales de piso a techo, vistas al casco histórico de Praga y cama king-size premium.',
    capacidad: '2 adultos',
    numeroCamas: 1,
    tipo: 'Doble'
  },
  {
    id: 'HAB005',
    nombre: 'Habitación Superior Doble',
    precio: 340,
    foto: 'https://giessbach.ch/images/image_uploads/_zimmer/307_DDGB-Zimmer.jpg',
    descripcion: 'Habitación refinada con dos camas individuales, escritorio de trabajo y baño privado con ducha efecto lluvia.',
    capacidad: '2 adultos',
    numeroCamas: 2,
    tipo: 'Doble'
  },
  {
    id: 'HAB006',
    nombre: 'Habitación Familiar Premium',
    precio: 610,
    foto: 'https://giessbach.ch/images/image_uploads/306_CDGB.jpg',
    descripcion: 'Amplia habitación diseñada para familias, equipada con cama king-size, sofá cama, área de juegos para niños y balcón privado.',
    capacidad: '2 adultos + 2 niños',
    numeroCamas: 2,
    tipo: 'Doble'
  },
  {
    id: 'HAB007',
    nombre: 'Habitación Individual Deluxe',
    precio: 270,
    foto: 'https://www.hola.com/horizon/original_aspect_ratio/f43d5e2f613c-habitaciones-hotel-8a-a.jpg',
    descripcion: 'Habitación individual de lujo con cama queen-size, escritorio de trabajo ergonómico y baño privado con acabados en mármol.',
    capacidad: '1 adulto',
    numeroCamas: 1,
    tipo: 'Sencilla'
  },
  {
    id: 'HAB008',
    nombre: 'Habitación Individual Estándar',
    precio: 150,
    foto: 'https://giessbach.ch/images/image_uploads/230_GLWA_neu.jpg',
    descripcion: 'Habitación sencilla y acogedora equipada con cama individual, escritorio y baño privado. Ideal para estancias cortas.',
    capacidad: '1 adulto',
    numeroCamas: 1,
    tipo: 'Sencilla'
  }
];

// Datos mock de servicios
const MOCK_SERVICIOS: Servicio[] = [
  {
    id: 'REST001',
    nombre: 'Restaurante Michelin 3 Estrellas',
    descripcion: 'Agradable para todo tipo de paladares',
    foto: 'https://cldnr.prod.webx.talpa.digital/talpa-network/image/fetch/f_auto,c_limit,w_3840,q_auto/https://images.ctfassets.net/mwdlh7x5m54h/72sO8UnNUwLASrqMK86d3x/bb012a3c1006d7daa6d6ca8bf0fb2690/pexels-cottonbro-6466288.jpg',
    categoria: 'Restaurante'
  },
  {
    id: 'SPA001',
    nombre: 'Spa Royal Bohemia',
    descripcion: 'Experiencia de relajación completa',
    foto: 'https://images.pexels.com/photos/6560304/pexels-photo-6560304.jpeg',
    categoria: 'Spa'
  },
  {
    id: 'BAR001',
    nombre: 'Bar Kompot Legendario',
    descripcion: 'Cócteles únicos y ambiente exclusivo',
    foto: 'https://offloadmedia.feverup.com/secretsanfrancisco.com/wp-content/uploads/2023/02/13023230/68693037_151390299393573_6890019703301565669_n-2-1024x683.jpg',
    categoria: 'Bar'
  },
  {
    id: 'CAFE001',
    nombre: 'Cafetería Imperial',
    descripcion: 'El mejor café de Praga',
    foto: 'https://swiss-historic-hotels.ch/bilder/hotels/grandhotel-giessbach/_AUTOxAUTO_crop_center-center_none/portrait-grandhotel-giessbach-brienz-swiss-historic-hotels-02.jpg',
    categoria: 'Cafetería'
  },
  {
    id: 'POOL001',
    nombre: 'Piscina Infinity Castillo',
    descripcion: 'Piscina con vistas al castillo',
    foto: 'https://giessbach.ch/images/image_uploads/GrandhotelGiessbach_%C2%A9DigitaleMassarbeit_503.jpg',
    categoria: 'Piscina'
  },
  {
    id: 'CONC001',
    nombre: 'Servicio de Conserjería Premium',
    descripcion: 'Asistencia personal las 24 horas',
    foto: 'https://guianzalibre.com/wp-content/uploads/2023/12/Agente-de-Viajes-1-1024x819.png',
    categoria: 'Servicios'
  },
  {
    id: 'ROOM001',
    nombre: 'Servicio de Habitaciones 24h',
    descripcion: 'Disponible las 24 horas del día',
    foto: 'https://media.gq.com.mx/photos/6155f165f3951529d43a0743/16:9/w_2991,h_1682,c_limit/GettyImages-56807633-lo-que-no-debes-pedir-de-room-service.jpg',
    categoria: 'Servicios'
  },
  {
    id: 'BUTLER001',
    nombre: 'Servicio de Mayordomo Personal',
    descripcion: 'Atención personalizada de lujo',
    foto: 'https://poloandtweed.com/wp-content/uploads/2023/02/Blog-Photos-5.png',
    categoria: 'Servicios'
  },
  {
    id: 'TRANS001',
    nombre: 'Traslados Privados de Lujo',
    descripcion: 'Transporte exclusivo en la ciudad',
    foto: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/09/5b/57/2a.jpg',
    categoria: 'Transporte'
  },
  {
    id: 'EVENT001',
    nombre: 'Salones para Eventos Privados',
    descripcion: 'Espacios únicos para celebraciones',
    foto: 'https://media-cdn.tripadvisor.com/media/photo-s/07/c5/bc/b0/grandhotel-giessbach.jpg',
    categoria: 'Eventos'
  },
  {
    id: 'LAUND001',
    nombre: 'Lavandería y Tintorería Premium',
    descripcion: 'Cuidado profesional de sus prendas',
    foto: 'https://www.love2laundry.com/blog/wp-content/uploads/2023/06/shutterstock_1019517997.jpg',
    categoria: 'Servicios'
  },
  {
    id: 'GYM001',
    nombre: 'Gimnasio Fitness Premium',
    descripcion: 'Equipamiento de última generación',
    foto: 'https://www.grandhotelpalace.gr/sites/default/files/styles/pagefull/public/130640-gym.jpg?itok=kGXeTJxG',
    categoria: 'Fitness'
  },
  {
    id: 'SHOP001',
    nombre: 'Boutique de Souvenirs de Lujo',
    descripcion: 'Recuerdos exclusivos de su estancia',
    foto: 'https://images.e-guma.ch/2644/events/f6684d91df1e4f8d90b9eb326908f654.jpeg',
    categoria: 'Shopping'
  },
  {
    id: 'PARK001',
    nombre: 'Servicio de Valet Parking',
    descripcion: 'Estacionamiento con servicio personalizado',
    foto: 'https://staffhotel.es/assets/2024/02/valet-hotel.jpg',
    categoria: 'Servicios'
  },
  {
    id: 'PET001',
    nombre: 'Cama de Lujo para Mascotas',
    descripcion: 'Comodidad premium para su mascota',
    foto: 'https://media.architecturaldigest.com/photos/56c7a8c1cd3bcb326e99b482/16:9/w_2580,c_limit/pet-friendly-luxury-hotels-01.jpg?mbid=social_retweet',
    categoria: 'Pet-Friendly'
  },
  {
    id: 'PET002',
    nombre: 'Menú Gourmet para Mascotas',
    descripcion: 'Alimentación premium para mascotas',
    foto: 'https://thesaucemag.com/wp-content/uploads/2024/08/dog-friendly-restaurants-london-megans-scaled.jpg',
    categoria: 'Pet-Friendly'
  },
  {
    id: 'PET003',
    nombre: 'Servicio de Paseos Premium',
    descripcion: 'Paseos profesionales para su mascota',
    foto: 'https://ichef.bbci.co.uk/ace/standard/2560/cpsprodpb/ddb5/live/6a81be00-0ee6-11f0-9471-fd068d782b6b.jpg',
    categoria: 'Pet-Friendly'
  },
  {
    id: 'PET004',
    nombre: 'Pet-Sitting Profesional',
    descripcion: 'Cuidado profesional mientras usted disfruta',
    foto: 'https://valleypetsitting.com/wp-content/uploads/2022/04/valley-pet-sitting-dogs-cats.jpg',
    categoria: 'Pet-Friendly'
  },
  {
    id: 'PET005',
    nombre: 'Spa y Grooming para Mascotas',
    descripcion: 'Tratamientos de belleza para mascotas',
    foto: 'https://hiccpet.com/cdn/shop/articles/benefits-of-grooming-your-pet-featured-image.png?v=1719858000',
    categoria: 'Pet-Friendly'
  },
  {
    id: 'PET006',
    nombre: 'Kit de Bienvenida Pet-Friendly',
    descripcion: 'Todo lo necesario para la llegada de su mascota',
    foto: 'https://americanlifestylemag.com/wp-content/uploads/2020/02/dog-lover-basket-intext.jpg',
    categoria: 'Pet-Friendly'
  },
  {
    id: 'WINE001',
    nombre: 'Cena Maridaje en Bodega Privada',
    descripcion: 'Experiencia gastronómica única',
    foto: 'https://media.istockphoto.com/id/991732782/es/foto/primer-plano-de-sumiller-sirviendo-vino-tinto-en-el-restaurante.jpg?s=612x612&w=0&k=20&c=pKjj9hZWme99DxzTBBL5pxPFAQCYvZLVmvtAmHPjh2M=',
    categoria: 'Gastronomía'
  },
  {
    id: 'HELI001',
    nombre: 'Tours en Helicóptero sobre Praga',
    descripcion: 'Vista aérea espectacular de la ciudad',
    foto: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0f/76/db/df.jpg',
    categoria: 'Tours'
  },
  {
    id: 'FLOAT001',
    nombre: 'Cena Romántica en Barco Privado',
    descripcion: 'Velada romántica navegando por el Moldava',
    foto: 'https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/dubriani.com/wp-content/uploads/2022/07/Image-01-png.webp',
    categoria: 'Romance'
  }
];