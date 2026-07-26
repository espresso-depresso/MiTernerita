import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions, } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DialogService } from "primeng/dynamicdialog";
import { providePrimeNG } from 'primeng/config';
import Material from '@primeng/themes/material';
import { tokenInterceptor } from './@core/interceptor/token.interceptor';

// Importar servicios originales (para mantener interfaces)
import { AuthService } from './@core/services/auth.service';
import { EventsService } from './@core/services/events.service';
import { TicketsService } from './@core/services/tickets.service';
import { FoodsService } from './@core/services/foods.service';
import { DrinksService } from './@core/services/drinks.service';
import { PaymentService } from './@core/services/payment.service';

// Importar servicios mock (que reemplazarán a los originales)
import { AuthMockService } from './@core/services/auth-mock.service';
import { EventsMockService } from './@core/services/events-mock.service';
import { TicketsMockService } from './@core/services/tickets-mock.service';
import { FoodsMockService } from './@core/services/foods-mock.service';
import { DrinksMockService } from './@core/services/drinks-mock.service';
import { PaymentsMockService } from './@core/services/payments-mock.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideAnimationsAsync(),
    MessageService,
    DialogService,
    providePrimeNG({
      theme: {
        preset: Material
      }
    }),
    
    // REEMPLAZAR SERVICIOS ORIGINALES CON SERVICIOS MOCK
    // Esto permite que toda la aplicación use la base de datos simulada
    // sin cambiar el código de los componentes
    { provide: AuthService, useClass: AuthMockService },
    { provide: EventsService, useClass: EventsMockService },
    { provide: TicketsService, useClass: TicketsMockService },
    { provide: FoodsService, useClass: FoodsMockService },
    { provide: DrinksService, useClass: DrinksMockService },
    { provide: PaymentService, useClass: PaymentsMockService },
    
    // También proporcionar los servicios mock directamente
    AuthMockService,
    EventsMockService,
    TicketsMockService,
    FoodsMockService,
    DrinksMockService,
    PaymentsMockService
  ]
};


