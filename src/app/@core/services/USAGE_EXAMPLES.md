# Ejemplos de Uso - Base de Datos Simulada

## Ejemplo 1: Obtener Eventos Activos

```typescript
import { Component, OnInit } from '@angular/core';
import { MockApiService } from './mock-api.service';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-event-list',
  template: `
    <div *ngFor="let event of events">
      <h3>{{ event.name }}</h3>
      <p>{{ event.description }}</p>
      <p>Fecha: {{ event.date | date:'dd/MM/yyyy' }}</p>
      <p>Hora: {{ event.time }}</p>
    </div>
  `
})
export class EventListComponent implements OnInit {
  events: Event[] = [];

  constructor(private mockApi: MockApiService) {}

  ngOnInit() {
    this.mockApi.getActiveEvents().subscribe({
      next: (events) => {
        this.events = events;
        console.log('Eventos cargados:', events);
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
      }
    });
  }
}
```

## Ejemplo 2: Autenticación de Usuario

```typescript
import { Component } from '@angular/core';
import { MockApiService } from './mock-api.service';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onLogin()">
      <input [(ngModel)]="email" name="email" placeholder="Email">
      <input [(ngModel)]="password" name="password" type="password" placeholder="Contraseña">
      <button type="submit">Iniciar Sesión</button>
    </form>
    <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
    <div *ngIf="user" class="success">
      Bienvenido {{ user.name }} {{ user.lastName }}
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  user: any = null;
  errorMessage = '';

  constructor(private mockApi: MockApiService) {}

  onLogin() {
    this.mockApi.login(this.email, this.password).subscribe({
      next: (user) => {
        this.user = user;
        this.errorMessage = '';
        console.log('Login exitoso:', user);
      },
      error: (error) => {
        this.user = null;
        this.errorMessage = 'Credenciales inválidas';
        console.error('Error en login:', error);
      }
    });
  }
}
```

## Ejemplo 3: Dashboard con Estadísticas

```typescript
import { Component, OnInit } from '@angular/core';
import { MockApiService } from './mock-api.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="stats-grid">
      <div class="stat-card" *ngIf="stats">
        <h3>Usuarios</h3>
        <p class="stat-number">{{ stats.totalUsers }}</p>
        <p class="stat-subtitle">Activos: {{ stats.activeUsers }}</p>
      </div>
      
      <div class="stat-card">
        <h3>Eventos</h3>
        <p class="stat-number">{{ stats?.totalEvents }}</p>
        <p class="stat-subtitle">Activos: {{ stats?.activeEvents }}</p>
      </div>
      
      <div class="stat-card">
        <h3>Tickets</h3>
        <p class="stat-number">{{ stats?.totalTickets }}</p>
        <p class="stat-subtitle">Vendidos: {{ stats?.activeTickets }}</p>
      </div>
      
      <div class="stat-card">
        <h3>Ingresos</h3>
        <p class="stat-number">${{ stats?.totalRevenue }}</p>
        <p class="stat-subtitle">Promedio: ${{ stats?.averageTicketPrice }}</p>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: any = null;

  constructor(private mockApi: MockApiService) {}

  ngOnInit() {
    this.mockApi.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        console.log('Estadísticas:', stats);
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });
  }
}
```

## Ejemplo 4: Crear Nuevo Evento

```typescript
import { Component } from '@angular/core';
import { MockApiService } from './mock-api.service';

@Component({
  selector: 'app-create-event',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="newEvent.name" name="name" placeholder="Nombre" required>
      <textarea [(ngModel)]="newEvent.description" name="description" placeholder="Descripción"></textarea>
      <input [(ngModel)]="newEvent.capacity" name="capacity" type="number" placeholder="Capacidad">
      <input [(ngModel)]="newEvent.room" name="room" placeholder="Sala">
      <button type="submit">Crear Evento</button>
    </form>
    <div *ngIf="successMessage" class="success">{{ successMessage }}</div>
    <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
  `
})
export class CreateEventComponent {
  newEvent = {
    name: '',
    description: '',
    capacity: 100,
    room: 'Salón Principal',
    status: 1
  };
  
  successMessage = '';
  errorMessage = '';

  constructor(private mockApi: MockApiService) {}

  onSubmit() {
    this.mockApi.createEvent(this.newEvent).subscribe({
      next: (createdEvent) => {
        this.successMessage = `Evento "${createdEvent.name}" creado exitosamente`;
        this.errorMessage = '';
        this.resetForm();
        console.log('Evento creado:', createdEvent);
      },
      error: (error) => {
        this.successMessage = '';
        this.errorMessage = 'Error al crear el evento';
        console.error('Error:', error);
      }
    });
  }

  resetForm() {
    this.newEvent = {
      name: '',
      description: '',
      capacity: 100,
      room: 'Salón Principal',
      status: 1
    };
  }
}
```

## Ejemplo 5: Búsqueda Avanzada

```typescript
import { Component } from '@angular/core';
import { MockApiService } from './mock-api.service';

@Component({
  selector: 'app-search',
  template: `
    <input [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Buscar...">
    
    <div *ngIf="searchResults">
      <h3>Resultados de búsqueda para "{{ searchTerm }}"</h3>
      
      <div *ngIf="searchResults.events.length > 0">
        <h4>Eventos ({{ searchResults.events.length }})</h4>
        <div *ngFor="let event of searchResults.events">
          {{ event.name }}
        </div>
      </div>
      
      <div *ngIf="searchResults.foods.length > 0">
        <h4>Comidas ({{ searchResults.foods.length }})</h4>
        <div *ngFor="let food of searchResults.foods">
          {{ food.description }}
        </div>
      </div>
      
      <div *ngIf="searchResults.drinks.length > 0">
        <h4>Bebidas ({{ searchResults.drinks.length }})</h4>
        <div *ngFor="let drink of searchResults.drinks">
          {{ drink.description }}
        </div>
      </div>
      
      <div *ngIf="searchResults.users.length > 0">
        <h4>Usuarios ({{ searchResults.users.length }})</h4>
        <div *ngFor="let user of searchResults.users">
          {{ user.name }} {{ user.lastName }}
        </div>
      </div>
      
      <div *ngIf="!hasResults()" class="no-results">
        No se encontraron resultados
      </div>
    </div>
  `
})
export class SearchComponent {
  searchTerm = '';
  searchResults: any = null;

  constructor(private mockApi: MockApiService) {}

  onSearch() {
    if (this.searchTerm.trim().length >= 2) {
      this.mockApi.searchAll(this.searchTerm).subscribe({
        next: (results) => {
          this.searchResults = results;
          console.log('Resultados:', results);
        },
        error: (error) => {
          console.error('Error en búsqueda:', error);
        }
      });
    } else {
      this.searchResults = null;
    }
  }

  hasResults(): boolean {
    if (!this.searchResults) return false;
    return (
      this.searchResults.events.length > 0 ||
      this.searchResults.foods.length > 0 ||
      this.searchResults.drinks.length > 0 ||
      this.searchResults.users.length > 0
    );
  }
}
```

## Ejemplo 6: Menú Completo

```typescript
import { Component, OnInit } from '@angular/core';
import { MockApiService } from './mock-api.service';

@Component({
  selector: 'app-menu',
  template: `
    <div class="menu-container">
      <h2>Menú Completo</h2>
      
      <div class="menu-section">
        <h3>Comidas</h3>
        <div class="menu-items">
          <div *ngFor="let food of foods" class="menu-item">
            <img [src]="getFoodImage(food)" [alt]="food.description">
            <div class="item-info">
              <h4>{{ food.description }}</h4>
              <p class="price">{{ food.price | currency }}</p>
              <span class="status" [class.available]="food.status === 1">
                {{ food.status === 1 ? 'Disponible' : 'Agotado' }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="menu-section">
        <h3>Bebidas</h3>
        <div class="menu-items">
          <div *ngFor="let drink of drinks" class="menu-item">
            <img [src]="getDrinkImage(drink)" [alt]="drink.description">
            <div class="item-info">
              <h4>{{ drink.description }}</h4>
              <p class="price">{{ drink.price | currency }}</p>
              <span class="status" [class.available]="drink.status === 1">
                {{ drink.status === 1 ? 'Disponible' : 'Agotado' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MenuComponent implements OnInit {
  foods: any[] = [];
  drinks: any[] = [];

  constructor(private mockApi: MockApiService) {}

  ngOnInit() {
    // Cargar comidas
    this.mockApi.getAllFoods().subscribe({
      next: (foods) => this.foods = foods,
      error: (error) => console.error('Error al cargar comidas:', error)
    });

    // Cargar bebidas
    this.mockApi.getAllDrinks().subscribe({
      next: (drinks) => this.drinks = drinks,
      error: (error) => console.error('Error al cargar bebidas:', error)
    });
  }

  getFoodImage(food: any): string {
    // Lógica para obtener imagen de comida
    return food.description.toLowerCase().includes('hamburguesa') 
      ? 'assets/img/hamburguesa.jpg'
      : 'assets/img/default-food.jpg';
  }

  getDrinkImage(drink: any): string {
    // Lógica para obtener imagen de bebida
    return drink.description.toLowerCase().includes('cerveza')
      ? 'assets/img/cerveza.jpg'
      : 'assets/img/default-drink.jpg';
  }
}
```

## Ejemplo 7: Sistema de Tickets

```typescript
import { Component, OnInit } from '@angular/core';
import { MockApiService } from './mock-api.service';

@Component({
  selector: 'app-ticket-system',
  template: `
    <div class="ticket-system">
      <h2>Sistema de Tickets</h2>
      
      <div class="buy-ticket" *ngIf="events.length > 0">
        <h3>Comprar Ticket</h3>
        <select [(ngModel)]="selectedEventId">
          <option *ngFor="let event of events" [value]="event.idEvents">
            {{ event.name }} - {{ event.date | date:'dd/MM/yyyy' }}
          </option>
        </select>
        <select [(ngModel)]="selectedZone">
          <option value="VIP">VIP - $50</option>
          <option value="General">General - $30</option>
          <option value="Económico">Económico - $20</option>
        </select>
        <button (click)="buyTicket()">Comprar Ticket</button>
      </div>
      
      <div class="ticket-list" *ngIf="tickets.length > 0">
        <h3>Tickets Comprados</h3>
        <div *ngFor="let ticket of tickets" class="ticket">
          <p>Evento: {{ getEventName(ticket.idEvent) }}</p>
          <p>Zona: {{ ticket.zone }}</p>
          <p>Precio: ${{ ticket.price }}</p>
          <p>Fecha: {{ ticket.purchaseDate | date:'dd/MM/yyyy HH:mm' }}</p>
        </div>
      </div>
    </div>
  `
})
export class TicketSystemComponent implements OnInit {
  events: any[] = [];
  tickets: any[] = [];
  selectedEventId = 0;
  selectedZone = 'General';

  constructor(private mockApi: MockApiService) {}

  ngOnInit() {
    // Cargar eventos activos
    this.mockApi.getActiveEvents().subscribe({
      next: (events) => {
        this.events = events;
        if (events.length > 0) {
          this.selectedEventId = events[0].idEvents;
        }
      }
    });

    // Cargar tickets del usuario (simulado como usuario 2)
    this.mockApi.getTicketsByUserId(2).subscribe({
      next: (tickets) => this.tickets = tickets
    });
  }

  buyTicket() {
    const price = this.getZonePrice(this.selectedZone);
    const ticketData = {
      idEvent: this.selectedEventId,
      idUser: 2, // Usuario simulado
      zone: this.selectedZone,
      price: price,
      status: 'active'
    };

    this.mockApi.createTicket(ticketData).subscribe({
      next: (newTicket) => {
        this.tickets.push(newTicket);
        console.log('Ticket comprado:', newTicket);
      },
      error: (error) => {
        console.error('Error al comprar ticket:', error);
      }
    });
  }

  getZonePrice(zone: string): number {
    const prices: { [key: string]: number } = {
      'VIP': 50,
      'General': 30,
      'Económico': 20
    };
    return prices[zone] || 30;
  }

  getEventName(eventId: number): string {
    const event = this.events.find(e => e.idEvents === eventId);
    return event ? event.name : 'Evento no encontrado';
  }
}
```

## Consejos de Uso

### 1. Manejo de Errores
```typescript
this.mockApi.someMethod().subscribe({
  next: (data) => { /* éxito */ },
  error: (error) => { 
    console.error('Error:', error);
    // Mostrar mensaje al usuario
  },
  complete: () => { /* operación completada */ }
});
```

### 2. Combinar Múltiples Llamadas
```typescript
import { forkJoin } from 'rxjs';

forkJoin({
  events: this.mockApi.getActiveEvents(),
  stats: this.mockApi.getDashboardStats(),
  menu: this.mockApi.getHomepageSummary()
}).subscribe({
  next: (results) => {
    console.log('Todos los datos:', results);
  }
});
```

### 3. Actualización en Tiempo Real
```typescript
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Actualizar estadísticas cada 30 segundos
interval(30000).pipe(
  switchMap(() => this.mockApi.getDashboardStats())
).subscribe(stats => {
  console.log('Estadísticas actualizadas:', stats);
});
```

## Notas Importantes

1. **Datos en Memoria**: Los datos se pierden al recargar la página
2. **Delays Simulados**: Las respuestas tienen delays para simular red
3. **IDs Autoincrementales**: Se generan automáticamente
4. **Sin Persistencia**: Para persistencia, considerar usar localStorage
5. **Testing**: Ideal para desarrollo y testing

## Pruebas Rápidas

Para probar rápidamente la base de datos:

```typescript
// En la consola del navegador
const mockApi = injector.get(MockApiService);
mockApi.getDashboardStats().subscribe(console.log);
```

O usar el componente home actualizado que ya incluye todas las funcionalidades.