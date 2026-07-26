import { Injectable, inject } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Event } from '../models/event.model';
import { MockDatabaseService } from './mock-database.service';

@Injectable({
  providedIn: 'root'
})
export class MockEventsService {
  private mockDb = inject(MockDatabaseService);

  /**
   * Obtiene todos los eventos de la base de datos simulada
   * Simula una llamada HTTP con un pequeño retraso
   */
  getEvents(): Observable<Event[]> {
    const events = this.mockDb.getAllEvents();
    return of(events).pipe(
      delay(300), // Simular latencia de red
      map(events => events.map(event => ({
        ...event,
        // Asegurar que las fechas sean objetos Date
        date: event.date instanceof Date ? event.date : new Date(event.date)
      })))
    );
  }

  /**
   * Obtiene eventos activos (status = 1)
   */
  getActiveEvents(): Observable<Event[]> {
    const events = this.mockDb.getActiveEvents();
    return of(events).pipe(
      delay(200),
      map(events => events.map(event => ({
        ...event,
        date: event.date instanceof Date ? event.date : new Date(event.date)
      })))
    );
  }

  /**
   * Obtiene un evento por su ID
   */
  getEventById(id: number): Observable<Event | undefined> {
    const event = this.mockDb.getEventById(id);
    return of(event).pipe(
      delay(150),
      map(event => event ? {
        ...event,
        date: event.date instanceof Date ? event.date : new Date(event.date)
      } : undefined)
    );
  }

  /**
   * Crea un nuevo evento
   */
  createEvent(eventData: Partial<Event>): Observable<Event> {
    const newEvent = this.mockDb.createEvent(eventData);
    return of(newEvent).pipe(
      delay(400),
      map(event => ({
        ...event,
        date: event.date instanceof Date ? event.date : new Date(event.date)
      }))
    );
  }

  /**
   * Actualiza un evento existente
   */
  updateEvent(id: number, eventData: Partial<Event>): Observable<Event | undefined> {
    const updatedEvent = this.mockDb.updateEvent(id, eventData);
    return of(updatedEvent).pipe(
      delay(350),
      map(event => event ? {
        ...event,
        date: event.date instanceof Date ? event.date : new Date(event.date)
      } : undefined)
    );
  }

  /**
   * Elimina un evento
   */
  deleteEvent(id: number): Observable<boolean> {
    const result = this.mockDb.deleteEvent(id);
    return of(result).pipe(delay(300));
  }

  /**
   * Obtiene estadísticas del evento
   */
  getEventStatistics(eventId: number): Observable<any> {
    const stats = this.mockDb.getEventStatistics(eventId);
    return of(stats).pipe(delay(250));
  }

  /**
   * Busca eventos por nombre o descripción
   */
  searchEvents(searchTerm: string): Observable<Event[]> {
    const allEvents = this.mockDb.getAllEvents();
    const searchTermLower = searchTerm.toLowerCase();
    
    const filteredEvents = allEvents.filter(event => 
      event.name.toLowerCase().includes(searchTermLower) ||
      event.description.toLowerCase().includes(searchTermLower)
    );

    return of(filteredEvents).pipe(
      delay(300),
      map(events => events.map(event => ({
        ...event,
        date: event.date instanceof Date ? event.date : new Date(event.date)
      })))
    );
  }

  /**
   * Obtiene eventos por rango de fechas
   */
  getEventsByDateRange(startDate: Date, endDate: Date): Observable<Event[]> {
    const allEvents = this.mockDb.getAllEvents();
    
    const filteredEvents = allEvents.filter(event => {
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
      return eventDate >= startDate && eventDate <= endDate;
    });

    return of(filteredEvents).pipe(
      delay(300),
      map(events => events.map(event => ({
        ...event,
        date: event.date instanceof Date ? event.date : new Date(event.date)
      })))
    );
  }

  /**
   * Obtiene eventos próximos (en el futuro)
   */
  getUpcomingEvents(limit?: number): Observable<Event[]> {
    const now = new Date();
    const allEvents = this.mockDb.getAllEvents();
    
    const upcomingEvents = allEvents
      .filter(event => {
        const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
        return eventDate > now && event.status === 1;
      })
      .sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date);
        const dateB = b.date instanceof Date ? b.date : new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

    const result = limit ? upcomingEvents.slice(0, limit) : upcomingEvents;
    
    return of(result).pipe(
      delay(200),
      map(events => events.map(event => ({
        ...event,
        date: event.date instanceof Date ? event.date : new Date(event.date)
      })))
    );
  }

  /**
   * Obtiene eventos con mayor capacidad
   */
  getEventsByCapacity(minCapacity: number): Observable<Event[]> {
    const allEvents = this.mockDb.getAllEvents();
    
    const filteredEvents = allEvents.filter(event => 
      event.capacity >= minCapacity && event.status === 1
    );

    return of(filteredEvents).pipe(
      delay(250),
      map(events => events.map(event => ({
        ...event,
        date: event.date instanceof Date ? event.date : new Date(event.date)
      })))
    );
  }
}