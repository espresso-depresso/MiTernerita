import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MockApiService } from '../../@core/services/mock-api.service';
import { MockEventsService } from '../../@core/services/mock-events.service';
import { map, Observable, tap, combineLatest, of } from 'rxjs';
import { Event } from '../../@core/models/event.model';
import { Food } from '../../@core/models/foods.model';
import { Drink } from '../../@core/models/drink.model';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    // RouterLink
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private router = inject(Router);
  private mockApi = inject(MockApiService);
  private mockEvents = inject(MockEventsService);
  private intervalId: any;
  events$!: Observable<Event[]>;
  slideIndex = signal(0);
  selectedIndex = 0;
  eventsLoaded: Event[] = [];
  
  // Nuevas propiedades para mostrar datos de la base de datos simulada
  dashboardStats$: Observable<any>;
  upcomingEvents$: Observable<Event[]>;
  menuHighlights$: Observable<{ foods: Food[]; drinks: Drink[] }>;
  systemStatus$: Observable<any>;

  @ViewChild('eventsGrid') eventsSection!: ElementRef;
  @ViewChild('zones') zonesSection!: ElementRef;
  @ViewChild('zones2') zonesSection2!: ElementRef;

  constructor() {
    // Inicializar las observables
    this.dashboardStats$ = this.mockApi.getDashboardStats();
    this.upcomingEvents$ = this.mockApi.getUpcomingEvents(5);
    this.menuHighlights$ = this.mockApi.getHomepageSummary().pipe(
      map(summary => summary.menuHighlights)
    );
    this.systemStatus$ = this.mockApi.checkSystemStatus();
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.2 });

    if (this.eventsSection && this.eventsSection.nativeElement) {
      observer.observe(this.eventsSection.nativeElement);
    }

    if (this.zonesSection && this.zonesSection.nativeElement) {
      observer.observe(this.zonesSection.nativeElement);
    }

    if (this.zonesSection2 && this.zonesSection2.nativeElement) {
      observer.observe(this.zonesSection2.nativeElement);
    }
  }

ngOnInit() {
  this.intervalId = setInterval(() => {
    this.nextSlide();
  }, 3500);

  // Usar la base de datos simulada para obtener eventos
  this.events$ = this.mockEvents.getActiveEvents().pipe(
    tap(events => this.eventsLoaded = events)
  );
  
  // Cargar datos adicionales en segundo plano
  this.loadAdditionalData();
}

private loadAdditionalData(): void {
  // Podemos cargar datos adicionales aquí si es necesario
  // Por ejemplo, para precargar datos que se usarán más tarde
}

  selectEvent(index: number){
    this.selectedIndex = index;
  }

  get selectedBackground(): string {
    if (this.eventsLoaded && this.eventsLoaded.length > 0) {
      const event = this.eventsLoaded[this.selectedIndex];
      if (event && event.image1) {
        // Usar la imagen del evento de la base de datos simulada
        return `url('${this.getFullUrl(event.image1)}')`;
      }
    }
    return '';
  }

  private getFullUrl(path: string): string {
    if (!path) return '';
    // Si ya es una URL absoluta (http:// o https://), devolver tal cual
    if (/^https?:\/\//i.test(path)) return path;
    // Si ya tiene una barra inicial, devolver tal cual (para rutas absolutas desde el dominio)
    if (path.startsWith('/')) return path;
    // Si es una ruta relativa (como 'assets/img/...'), devolver tal cual
    // Angular resolverá estas rutas automáticamente desde el directorio raíz
    return path;
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    if (this.eventsLoaded && this.eventsLoaded.length > 0) {
      this.slideIndex.update(i => (i + 1) % this.eventsLoaded.length);
    }
  }

  prevSlide() {
    if (this.eventsLoaded && this.eventsLoaded.length > 0) {
      this.slideIndex.update(i => (i - 1 + this.eventsLoaded.length) % this.eventsLoaded.length);
    }
  }

  // Nuevos métodos para mostrar datos de la base de datos simulada
  getEventImage(event: Event): string {
    if (event.flyer) return this.getFullUrl(event.flyer);
    if (event.image1) return this.getFullUrl(event.image1);
    if (event.image2) return this.getFullUrl(event.image2);
    if (event.image3) return this.getFullUrl(event.image3);
    return './assets/img/evento.jpg';
  }

  getFoodImage(food: Food): string {
    // Simular una URL de imagen para comida
    return food.description.toLowerCase().includes('hamburguesa') ? './assets/img/hamburguesa.jpeg' :
           food.description.toLowerCase().includes('pizza') ? './assets/img/pizza.jpeg' :
           food.description.toLowerCase().includes('ensalada') ? './assets/img/ensalada.jpeg' :
           './assets/img/fingers.jpg';
  }

  getDrinkImage(drink: Drink): string {
    // Simular una URL de imagen para bebida
    return drink.description.toLowerCase().includes('cerveza') ? './assets/img/cerveza.jpeg' :
           drink.description.toLowerCase().includes('margarita') ? './assets/img/margarita.jpeg' :
           drink.description.toLowerCase().includes('refresco') ? './assets/img/refresco.jpeg' :
           './assets/img/ron1.png';
  }

  getEventStatus(event: Event): string {
    return event.status === 1 ? 'Activo' : 'Inactivo';
  }

  getItemStatus(item: Food | Drink): string {
    return item.status === 1 ? 'Disponible' : 'Agotado';
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  getFormattedDate(date: Date | string): string {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getTimeRemaining(eventDate: Date | string): string {
    const eventDateObj = eventDate instanceof Date ? eventDate : new Date(eventDate);
    const now = new Date();
    const diffMs = eventDateObj.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Ya pasó';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `En ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `En ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else {
      return 'Próximamente';
    }
  }


  formatTime(time: string): string {
    if (!time) return '';
  
    const [hours, minutes, seconds] = time.split(':').map(Number);
  
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    const formattedHours = hours % 12 || 12;
  
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  navigateToEvent(idEvento: number){
    this.router.navigate(['/home/event/', idEvento]).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  goToEvent(idEvent: number){
    this.router.navigate(['/home/event/', idEvent]).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
