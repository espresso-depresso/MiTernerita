import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  // Claves de localStorage para datos persistente
  public readonly STORAGE_KEYS = {
    USERS: 'mock_users',
      PAYMENTS: 'mock_payments',
    EVENTS: 'mock_events',
    FOODS: 'mock_foods',
    DRINKS: 'mock_drinks',
    TICKETS: 'mock_tickets',
    ENTRIES: 'mock_entries',
    USER_COUNTER: 'mock_user_counter',
      PAYMENT_COUNTER: 'mock_payment_counter',
    EVENT_COUNTER: 'mock_event_counter',
    FOOD_COUNTER: 'mock_food_counter',
    DRINK_COUNTER: 'mock_drink_counter',
    TICKET_COUNTER: 'mock_ticket_counter',
    ENTRY_COUNTER: 'mock_entry_counter',
    TICKET_ZONES: 'mock_ticket_zones'
  };

  // Guardar un item en localStorage
  save(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error al guardar en localStorage (${key}):`, error);
    }
  }

  // Obtener un item de localStorage
  get<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) as T : null;
    } catch (error) {
      console.error(`Error al obtener de localStorage (${key}):`, error);
      return null;
    }
  }

  // Obtener un item de localStorage (sin tipado)
  getRaw(key: string): any {
    return this.get(key);
  }

  // Eliminar un item de localStorage
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  // Limpiar todos los datos de localStorage
  clearAll(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Verificar si existe un item
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  // Guardar datos de usuarios
  saveUsers(users: any[]): void {
    this.save(this.STORAGE_KEYS.USERS, users);
  }

  // Guardar datos de eventos
  saveEvents(events: any[]): void {
    this.save(this.STORAGE_KEYS.EVENTS, events);
  }

  // Guardar datos de comidas
  saveFoods(foods: any[]): void {
    this.save(this.STORAGE_KEYS.FOODS, foods);
  }

  // Guardar datos de bebidas
  saveDrinks(drinks: any[]): void {
    this.save(this.STORAGE_KEYS.DRINKS, drinks);
  }

  // Guardar datos de tickets
  saveTickets(tickets: any[]): void {
    this.save(this.STORAGE_KEYS.TICKETS, tickets);
  }

  // Guardar datos de entradas
  saveEntries(entries: any[]): void {
    this.save(this.STORAGE_KEYS.ENTRIES, entries);
  }

  // Guardar datos de pagos
  savePayments(payments: any[]): void {
    this.save(this.STORAGE_KEYS.PAYMENTS, payments);
  }

  // Guardar contadores
  saveCounters(counters: { userCounter: number; eventCounter: number; foodCounter: number; drinkCounter: number; ticketCounter: number; entryCounter: number }): void {
    this.save(this.STORAGE_KEYS.USER_COUNTER, counters.userCounter);
    this.save(this.STORAGE_KEYS.EVENT_COUNTER, counters.eventCounter);
    this.save(this.STORAGE_KEYS.FOOD_COUNTER, counters.foodCounter);
    this.save(this.STORAGE_KEYS.DRINK_COUNTER, counters.drinkCounter);
    this.save(this.STORAGE_KEYS.TICKET_COUNTER, counters.ticketCounter);
    this.save(this.STORAGE_KEYS.ENTRY_COUNTER, counters.entryCounter);
  }

  // Guardar zonas de tickets
  saveTicketZones(zones: any[]): void {
    this.save(this.STORAGE_KEYS.TICKET_ZONES, zones);
  }

  // Cargar todos los datos
  loadAll(): any {
    return {
      users: this.get(this.STORAGE_KEYS.USERS) || [],
      events: this.get(this.STORAGE_KEYS.EVENTS) || [],
      foods: this.get(this.STORAGE_KEYS.FOODS) || [],
      drinks: this.get(this.STORAGE_KEYS.DRINKS) || [],
      tickets: this.get(this.STORAGE_KEYS.TICKETS) || [],
      entries: this.get(this.STORAGE_KEYS.ENTRIES) || [],
      userCounter: this.get(this.STORAGE_KEYS.USER_COUNTER) || 1,
      eventCounter: this.get(this.STORAGE_KEYS.EVENT_COUNTER) || 1,
      foodCounter: this.get(this.STORAGE_KEYS.FOOD_COUNTER) || 1,
      drinkCounter: this.get(this.STORAGE_KEYS.DRINK_COUNTER) || 1,
      ticketCounter: this.get(this.STORAGE_KEYS.TICKET_COUNTER) || 1,
      entryCounter: this.get(this.STORAGE_KEYS.ENTRY_COUNTER) || 1
    };
  }

  // Cargar zonas de tickets
  loadTicketZones(): any[] {
    return this.get(this.STORAGE_KEYS.TICKET_ZONES) || [
      { id: 1, name: 'VIP', price: 50.00 },
      { id: 2, name: 'General', price: 30.00 },
      { id: 3, name: 'Económico', price: 20.00 }
    ];
  }
}