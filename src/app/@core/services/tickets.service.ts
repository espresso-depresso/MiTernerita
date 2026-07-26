import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.developer';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, Subject, tap, Observable, of } from 'rxjs';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private api: string = environment.api;
  private http = inject(HttpClient);
  private refreshTickets$ = new Subject<void>();
  public refreshTicketsObservable$ = this.refreshTickets$.asObservable();

  getTickets(){
    return this.http.get<Ticket[]>(`${this.api}/ticket`).pipe(
      map((tickets: Ticket[] = []) => {
        return tickets.map(ticket => ({
          ...ticket
        }));
      }),
      catchError((error) => {
        console.error('Error al obtener las entradas:', error);
        return [];
      })
    )
  }

  getTicktesByEvent(idEvents: number){
    return this.http.get<Ticket[]>(`${this.api}/ticket/events/${idEvents}`);
  }

  // Obtener zonas disponibles para selección
  getTicketZones(eventId?: number): Observable<any[]> {
    // Datos de zonas disponibles para selección
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

    // Simular llamada a API
    return of(filteredZones).pipe(delay(300));
  }

  createTicket(data: any){
    return this.http.post(`${this.api}/ticket`, data).pipe(
      tap(() => this.refreshTickets$.next())
    )
  }

  updateTicket(id: number, data: any){
    return this.http.put(`${this.api}/ticket/${id}`, data).pipe(
      tap(() => this.refreshTickets$.next())
    );
  }

  deleteTicket(id: number){
    return this.http.delete(`${this.api}/ticket/${id}`).pipe(
      tap(() => this.refreshTickets$.next())
    );
  }
}
