import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.developer';
import { catchError, delay, map, Subject, tap, Observable, of } from 'rxjs';
import { MockApiService } from './mock-api.service';

export interface Ticket {
  idTicket: number;
  idEvent: number;
  idUser: number;
  zone: string;
  price: number;
  purchaseDate: Date;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketsMockService {
  private mockApi = inject(MockApiService);
  private refreshTickets$ = new Subject<void>();
  public refreshTicketsObservable$ = this.refreshTickets$.asObservable();

  // Obtener todos los tickets
  getTickets(): Observable<Ticket[]> {
    return this.mockApi.getAllTickets().pipe(
      map((tickets: Ticket[]) => {
        return tickets.map(ticket => ({
          ...ticket,
          purchaseDate: ticket.purchaseDate instanceof Date ? ticket.purchaseDate : new Date(ticket.purchaseDate)
        }));
      }),
      catchError((error) => {
        console.error('Error al obtener tickets de la base de datos simulada:', error);
        return [];
      })
    );
  }

  // Obtener ticket por ID
  getTicketById(id: number): Observable<Ticket> {
    return this.mockApi.getAllTickets().pipe(
      map(tickets => {
        const ticket = tickets.find(t => t.idTicket === id);
        if (!ticket) {
          throw new Error(`Ticket con ID ${id} no encontrado`);
        }
        return {
          ...ticket,
          purchaseDate: ticket.purchaseDate instanceof Date ? ticket.purchaseDate : new Date(ticket.purchaseDate)
        };
      }),
      catchError((error) => {
        console.error(`Error al obtener ticket con ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Crear ticket
  createTicket(data: any): Observable<any> {
    // Generar ID único para el nuevo ticket (usar timestamp como ID único)
    const newTicketData = {
      ...data,
      idTicket: Date.now(), // Usar timestamp como ID único
      purchaseDate: new Date(),
      status: 'active'
    };

    return this.mockApi.createTicket(newTicketData).pipe(
      tap(() => {
        this.refreshTickets$.next();
        console.log('Ticket creado en base de datos simulada:', newTicketData);
      }),
      map((createdTicket) => ({
        ...createdTicket,
        message: 'Ticket creado exitosamente',
        success: true
      })),
      catchError((error) => {
        console.error('Error al crear ticket:', error);
        throw error;
      })
    );
  }

  // Actualizar ticket
  updateTicket(id: number, data: any): Observable<any> {
    // En la base de datos simulada, actualizamos directamente
    return this.mockApi.getAllTickets().pipe(
      map(tickets => {
        const ticketIndex = tickets.findIndex(t => t.idTicket === id);
        if (ticketIndex === -1) {
          throw new Error(`Ticket con ID ${id} no encontrado`);
        }
        
        // Actualizar ticket
        const updatedTicket = {
          ...tickets[ticketIndex],
          ...data
        };
        
        // Simular actualización exitosa
        return updatedTicket;
      }),
      tap(() => {
        this.refreshTickets$.next();
        console.log('Ticket actualizado en base de datos simulada:', id, data);
      }),
      map((updatedTicket) => ({
        ...updatedTicket,
        message: 'Ticket actualizado exitosamente',
        success: true
      })),
      catchError((error) => {
        console.error(`Error al actualizar ticket con ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Eliminar ticket
  deleteTicket(id: number): Observable<any> {
    // Simular eliminación exitosa
    return of(true).pipe(
      tap(() => {
        this.refreshTickets$.next();
        console.log('Ticket eliminado de base de datos simulada:', id);
      }),
      map(() => ({
        message: 'Ticket eliminado exitosamente',
        success: true
      })),
      catchError((error) => {
        console.error(`Error al eliminar ticket con ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Métodos adicionales para simulación
  getTicketsByUserId(userId: number): Observable<Ticket[]> {
    return this.mockApi.getTicketsByUserId(userId).pipe(
      map(tickets => tickets.map(ticket => ({
        ...ticket,
        purchaseDate: ticket.purchaseDate instanceof Date ? ticket.purchaseDate : new Date(ticket.purchaseDate)
      })))
    );
  }

  getTicketsByEventId(eventId: number): Observable<Ticket[]> {
    return this.mockApi.getTicketsByEventId(eventId).pipe(
      map(tickets => tickets.map(ticket => ({
        ...ticket,
        purchaseDate: ticket.purchaseDate instanceof Date ? ticket.purchaseDate : new Date(ticket.purchaseDate)
      })))
    );
  }

  // Método con typo para mantener compatibilidad (getTicktesByEvent)
  getTicktesByEvent(eventId: number): Observable<Ticket[]> {
    console.warn('Usando método deprecado getTicktesByEvent, usar getTicketsByEventId en su lugar');
    return this.getTicketsByEventId(eventId);
  }



  // Simular compra de ticket
  purchaseTicket(eventId: number, userId: number, zone: string, price: number): Observable<Ticket> {
    const ticketData = {
      idEvent: eventId,
      idUser: userId,
      zone: zone,
      price: price,
      status: 'active'
    };

    return this.createTicket(ticketData).pipe(
      map(response => response as Ticket)
    );
  }

  // Simular validación de ticket
  validateTicket(ticketId: number): Observable<{ valid: boolean; message: string }> {
    return this.getTicketById(ticketId).pipe(
      map(ticket => {
        if (ticket.status === 'active') {
          return {
            valid: true,
            message: 'Ticket válido y activo'
          };
        } else {
          return {
            valid: false,
            message: 'Ticket no válido o inactivo'
          };
        }
      }),
      catchError(() => of({
        valid: false,
        message: 'Ticket no encontrado'
      }))
    );
  }

  // Método para obtener zonas disponibles (para el dropdown)
  getTicketZones(eventId?: number): Observable<any[]> {
    // Simular zonas disponibles
    const zones = [
      { idTicket: 101, name: 'VIP', price: 50.00, description: 'Zona VIP con asientos preferenciales', status: 'available' },
      { idTicket: 102, name: 'General', price: 30.00, description: 'Zona general con vista completa', status: 'available' },
      { idTicket: 103, name: 'Económico', price: 20.00, description: 'Zona económica', status: 'available' },
      { idTicket: 104, name: 'Palco', price: 75.00, description: 'Palco privado', status: 'available' },
      { idTicket: 105, name: 'Platea', price: 40.00, description: 'Platea central', status: 'available' }
    ];

    // Filtrar por evento si se especifica
    const filteredZones = eventId 
      ? zones.map(zone => ({ ...zone, idEvent: eventId }))
      : zones;

    return of(filteredZones).pipe(delay(300));
  }
}