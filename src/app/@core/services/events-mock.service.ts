import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.developer';
import { catchError, map, Subject, tap, Observable, of } from 'rxjs';
import { Event } from '../models/event.model';
import { MockApiService } from './mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class EventsMockService {
  private mockApi = inject(MockApiService);
  private refreshEvents$ = new Subject<void>();
  public refreshEventsObservable$ = this.refreshEvents$.asObservable();

  // Método para obtener eventos - usa base de datos simulada
  getEvents(): Observable<Event[]> {
    return this.mockApi.getAllEvents().pipe(
      map((events: Event[]) => {
        return events.map(event => ({
          ...event,
          // Asegurar formato consistente
          date: event.date instanceof Date ? event.date : new Date(event.date)
        }));
      }),
      catchError((error) => {
        console.error('Error al obtener los eventos de la base de datos simulada:', error);
        return [];
      })
    );
  }

  // Obtener evento por ID
  getEventById(id: number): Observable<Event> {
    return this.mockApi.getEventById(id).pipe(
      map(event => {
        if (!event) {
          throw new Error(`Evento con ID ${id} no encontrado`);
        }
        return {
          ...event,
          date: event.date instanceof Date ? event.date : new Date(event.date)
        };
      }),
      catchError((error) => {
        console.error(`Error al obtener el evento con ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Crear evento
  createEvent(data: any): Observable<any> {
    return this.mockApi.createEvent(data).pipe(
      tap(() => {
        this.refreshEvents$.next();
        console.log('Evento creado en base de datos simulada:', data);
      }),
      map((createdEvent) => ({
        ...createdEvent,
        // Simular respuesta de API real
        message: 'Evento creado exitosamente',
        success: true
      })),
      catchError((error) => {
        console.error('Error al crear evento:', error);
        throw error;
      })
    );
  }

  // Actualizar evento
  updateEvent(id: number, data: any): Observable<any> {
    return this.mockApi.updateEvent(id, data).pipe(
      tap(() => {
        this.refreshEvents$.next();
        console.log('Evento actualizado en base de datos simulada:', id, data);
      }),
      map((updatedEvent) => {
        if (!updatedEvent) {
          throw new Error(`Evento con ID ${id} no encontrado para actualizar`);
        }
        return {
          ...updatedEvent,
          message: 'Evento actualizado exitosamente',
          success: true
        };
      }),
      catchError((error) => {
        console.error(`Error al actualizar evento con ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Actualizar evento con JSON (mismo que updateEvent para simulación)
  updateEventJson(id: number, data: any): Observable<any> {
    return this.updateEvent(id, data).pipe(
      map(response => ({
        ...response,
        message: 'Evento actualizado con JSON exitosamente'
      }))
    );
  }

  // Eliminar evento
  deleteEvent(id: number): Observable<any> {
    return this.mockApi.deleteEvent(id).pipe(
      tap(() => {
        this.refreshEvents$.next();
        console.log('Evento eliminado de base de datos simulada:', id);
      }),
      map((success) => {
        if (success) {
          return {
            message: 'Evento eliminado exitosamente',
            success: true
          };
        } else {
          throw new Error(`Evento con ID ${id} no encontrado para eliminar`);
        }
      }),
      catchError((error) => {
        console.error(`Error al eliminar evento con ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Métodos adicionales útiles para la simulación
  getActiveEvents(): Observable<Event[]> {
    return this.mockApi.getActiveEvents().pipe(
      map(events => events.map(event => ({
        ...event,
        date: event.date instanceof Date ? event.date : new Date(event.date)
      })))
    );
  }

  getUpcomingEvents(limit?: number): Observable<Event[]> {
    return this.mockApi.getUpcomingEvents(limit).pipe(
      map(events => events.map(event => ({
        ...event,
        date: event.date instanceof Date ? event.date : new Date(event.date)
      })))
    );
  }

  // Simular estadísticas del evento
  getEventStatistics(eventId: number): Observable<any> {
    // Usar MockDatabaseService directamente para estadísticas
    return this.mockApi.getAllEvents().pipe(
      map(events => {
        const event = events.find(e => e.idEvents === eventId);
        if (!event) {
          return {
            eventName: 'Evento no encontrado',
            capacity: 0,
            ticketsSold: 0,
            entriesCount: 0,
            activeEntries: 0,
            occupancyRate: 0
          };
        }
        
        // Simular estadísticas básicas
        return {
          eventName: event.name,
          capacity: event.capacity,
          ticketsSold: Math.floor(event.capacity * 0.7), // 70% vendido
          entriesCount: Math.floor(event.capacity * 0.5), // 50% han entrado
          activeEntries: Math.floor(event.capacity * 0.3), // 30% actualmente dentro
          occupancyRate: 50 // 50% de ocupación
        };
      })
    );
  }
}