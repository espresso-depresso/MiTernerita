import { Injectable, inject } from '@angular/core';
import { Observable, of, delay, map, combineLatest } from 'rxjs';
import { User } from '../models/user.model';
import { Event } from '../models/event.model';
import { Food } from '../models/foods.model';
import { Drink } from '../models/drink.model';
import { MockDatabaseService, Ticket, Entry } from './mock-database.service';
import { MockAuthService } from './mock-auth.service';
import { MockEventsService } from './mock-events.service';
import { MockFoodsDrinksService } from './mock-foods-drinks.service';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private mockDb = inject(MockDatabaseService);
  private mockAuth = inject(MockAuthService);
  private mockEvents = inject(MockEventsService);
  private mockFoodsDrinks = inject(MockFoodsDrinksService);

  // ========== DASHBOARD Y ESTADÍSTICAS ==========

  /**
   * Obtener estadísticas generales del sistema
   */
  getDashboardStats(): Observable<any> {
    const users = this.mockDb.getAllUsers();
    const events = this.mockDb.getAllEvents();
    const foods = this.mockDb.getAllFoods();
    const drinks = this.mockDb.getAllDrinks();
    const tickets = this.mockDb.getAllTickets();
    const entries = this.mockDb.getAllEntries();

    const activeUsers = users.filter(u => u.idRole === 2).length; // Usuarios normales
    const activeEvents = events.filter(e => e.status === 1).length;
    const activeFoods = foods.filter(f => f.status === 1).length;
    const activeDrinks = drinks.filter(d => d.status === 1).length;
    const activeTickets = tickets.filter(t => t.status === 'active').length;
    const activeEntries = entries.filter(e => !e.exitTime).length;

    const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.price, 0);

    return of({
      totalUsers: users.length,
      activeUsers,
      totalEvents: events.length,
      activeEvents,
      totalFoods: foods.length,
      activeFoods,
      totalDrinks: drinks.length,
      activeDrinks,
      totalTickets: tickets.length,
      activeTickets,
      totalEntries: entries.length,
      activeEntries,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      averageTicketPrice: tickets.length > 0 
        ? parseFloat((totalRevenue / tickets.length).toFixed(2)) 
        : 0,
      systemHealth: 'good' as const,
      lastUpdated: new Date()
    }).pipe(delay(500));
  }

  /**
   * Obtener resumen para la página de inicio
   */
  getHomepageSummary(): Observable<any> {
    return combineLatest([
      this.mockEvents.getUpcomingEvents(3),
      this.mockEvents.getActiveEvents(),
      this.mockFoodsDrinks.getFullMenu(),
      of(this.mockDb.getAllUsers().length),
      of(this.mockDb.getAllTickets().length)
    ]).pipe(
      delay(400),
      map(([upcomingEvents, activeEvents, menu, totalUsers, totalTickets]) => ({
        upcomingEvents,
        totalActiveEvents: activeEvents.length,
        totalFoodItems: menu.foods.length,
        totalDrinkItems: menu.drinks.length,
        totalUsers,
        totalTickets,
        featuredEvent: upcomingEvents[0] || null,
        menuHighlights: {
          foods: menu.foods.slice(0, 3),
          drinks: menu.drinks.slice(0, 3)
        }
      }))
    );
  }

  // ========== USUARIOS ==========

  /**
   * Autenticación
   */
  login(email: string, password: string): Observable<User> {
    return this.mockAuth.login(email, password);
  }

  /**
   * Registro
   */
  register(userData: Partial<User>): Observable<User> {
    return this.mockAuth.register(userData);
  }

  /**
   * Obtener todos los usuarios
   */
  getAllUsers(): Observable<User[]> {
    return this.mockAuth.getAllUsers();
  }

  /**
   * Obtener usuario por ID
   */
  getUserById(id: number): Observable<User | undefined> {
    return this.mockAuth.getUserById(id);
  }

  /**
   * Actualizar usuario
   */
  updateUser(id: number, userData: Partial<User>): Observable<User | undefined> {
    return this.mockAuth.updateUser(id, userData);
  }

  /**
   * Eliminar usuario
   */
  deleteUser(id: number): Observable<boolean> {
    return this.mockAuth.deleteUser(id);
  }

  // ========== EVENTOS ==========

  /**
   * Obtener todos los eventos
   */
  getAllEvents(): Observable<Event[]> {
    return this.mockEvents.getEvents();
  }

  /**
   * Obtener eventos activos
   */
  getActiveEvents(): Observable<Event[]> {
    return this.mockEvents.getActiveEvents();
  }

  /**
   * Obtener evento por ID
   */
  getEventById(id: number): Observable<Event | undefined> {
    return this.mockEvents.getEventById(id);
  }

  /**
   * Crear evento
   */
  createEvent(eventData: Partial<Event>): Observable<Event> {
    return this.mockEvents.createEvent(eventData);
  }

  /**
   * Actualizar evento
   */
  updateEvent(id: number, eventData: Partial<Event>): Observable<Event | undefined> {
    return this.mockEvents.updateEvent(id, eventData);
  }

  /**
   * Eliminar evento
   */
  deleteEvent(id: number): Observable<boolean> {
    return this.mockEvents.deleteEvent(id);
  }

  /**
   * Obtener eventos próximos
   */
  getUpcomingEvents(limit?: number): Observable<Event[]> {
    return this.mockEvents.getUpcomingEvents(limit);
  }

  // ========== COMIDAS ==========

  /**
   * Obtener todas las comidas
   */
  getAllFoods(): Observable<Food[]> {
    return this.mockFoodsDrinks.getAllFoods();
  }

  /**
   * Obtener comidas activas
   */
  getActiveFoods(): Observable<Food[]> {
    return this.mockFoodsDrinks.getActiveFoods();
  }

  /**
   * Obtener comida por ID
   */
  getFoodById(id: number): Observable<Food | undefined> {
    return this.mockFoodsDrinks.getFoodById(id);
  }

  /**
   * Crear comida
   */
  createFood(foodData: Partial<Food>): Observable<Food> {
    return this.mockFoodsDrinks.createFood(foodData);
  }

  /**
   * Actualizar comida
   */
  updateFood(id: number, foodData: Partial<Food>): Observable<Food | undefined> {
    return this.mockFoodsDrinks.updateFood(id, foodData);
  }

  /**
   * Eliminar comida
   */
  deleteFood(id: number): Observable<boolean> {
    return this.mockFoodsDrinks.deleteFood(id);
  }

  // ========== BEBIDAS ==========

  /**
   * Obtener todas las bebidas
   */
  getAllDrinks(): Observable<Drink[]> {
    return this.mockFoodsDrinks.getAllDrinks();
  }

  /**
   * Obtener bebidas activas
   */
  getActiveDrinks(): Observable<Drink[]> {
    return this.mockFoodsDrinks.getActiveDrinks();
  }

  /**
   * Obtener bebida por ID
   */
  getDrinkById(id: number): Observable<Drink | undefined> {
    return this.mockFoodsDrinks.getDrinkById(id);
  }

  /**
   * Crear bebida
   */
  createDrink(drinkData: Partial<Drink>): Observable<Drink> {
    return this.mockFoodsDrinks.createDrink(drinkData);
  }

  /**
   * Actualizar bebida
   */
  updateDrink(id: number, drinkData: Partial<Drink>): Observable<Drink | undefined> {
    return this.mockFoodsDrinks.updateDrink(id, drinkData);
  }

  /**
   * Eliminar bebida
   */
  deleteDrink(id: number): Observable<boolean> {
    return this.mockFoodsDrinks.deleteDrink(id);
  }

  // ========== TICKETS Y ENTRADAS ==========

  /**
   * Obtener todos los tickets
   */
  getAllTickets(): Observable<Ticket[]> {
    const tickets = this.mockDb.getAllTickets();
    return of(tickets).pipe(delay(300));
  }

  /**
   * Obtener tickets por usuario
   */
  getTicketsByUserId(userId: number): Observable<Ticket[]> {
    const tickets = this.mockDb.getTicketsByUserId(userId);
    return of(tickets).pipe(delay(250));
  }

  /**
   * Obtener tickets por evento
   */
  getTicketsByEventId(eventId: number): Observable<Ticket[]> {
    const tickets = this.mockDb.getTicketsByEventId(eventId);
    return of(tickets).pipe(delay(250));
  }

  /**
   * Crear ticket
   */
  createTicket(ticketData: Partial<Ticket>): Observable<Ticket> {
    const ticket = this.mockDb.createTicket(ticketData);
    return of(ticket).pipe(delay(350));
  }

  /**
   * Obtener todas las entradas
   */
  getAllEntries(): Observable<Entry[]> {
    const entries = this.mockDb.getAllEntries();
    return of(entries).pipe(delay(300));
  }

  /**
   * Obtener entradas por evento
   */
  getEntriesByEventId(eventId: number): Observable<Entry[]> {
    const entries = this.mockDb.getEntriesByEventId(eventId);
    return of(entries).pipe(delay(250));
  }

  /**
   * Obtener entradas activas por evento
   */
  getActiveEntriesByEventId(eventId: number): Observable<Entry[]> {
    const entries = this.mockDb.getActiveEntriesByEventId(eventId);
    return of(entries).pipe(delay(250));
  }

  /**
   * Crear entrada
   */
  createEntry(entryData: Partial<Entry>): Observable<Entry> {
    const entry = this.mockDb.createEntry(entryData);
    return of(entry).pipe(delay(350));
  }

  /**
   * Registrar salida
   */
  registerExit(entryId: number): Observable<Entry | undefined> {
    const entry = this.mockDb.updateEntry(entryId, { exitTime: new Date() });
    return of(entry).pipe(delay(300));
  }

  // ========== BÚSQUEDA Y FILTROS ==========

  /**
   * Búsqueda global
   */
  searchAll(searchTerm: string): Observable<{
    events: Event[];
    foods: Food[];
    drinks: Drink[];
    users: User[];
  }> {
    const allEvents = this.mockDb.getAllEvents();
    const allFoods = this.mockDb.getAllFoods();
    const allDrinks = this.mockDb.getAllDrinks();
    const allUsers = this.mockDb.getAllUsers();

    const searchTermLower = searchTerm.toLowerCase();

    const filteredEvents = allEvents.filter(event => 
      event.name.toLowerCase().includes(searchTermLower) ||
      event.description.toLowerCase().includes(searchTermLower)
    );

    const filteredFoods = allFoods.filter(food => 
      food.description.toLowerCase().includes(searchTermLower)
    );

    const filteredDrinks = allDrinks.filter(drink => 
      drink.description.toLowerCase().includes(searchTermLower)
    );

    const filteredUsers = allUsers.filter(user => 
      user.name.toLowerCase().includes(searchTermLower) ||
      user.lastName.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower)
    );

    return of({
      events: filteredEvents,
      foods: filteredFoods,
      drinks: filteredDrinks,
      users: filteredUsers.map(user => ({ ...user, password: '********' }))
    }).pipe(delay(400));
  }

  /**
   * Verificar disponibilidad del sistema
   */
  checkSystemStatus(): Observable<{
    database: string;
    services: Array<{ name: string; status: string; latency: number }>;
    timestamp: Date;
  }> {
    return of({
      database: 'online',
      services: [
        { name: 'auth', status: 'up', latency: Math.floor(Math.random() * 100) + 50 },
        { name: 'events', status: 'up', latency: Math.floor(Math.random() * 150) + 75 },
        { name: 'foods', status: 'up', latency: Math.floor(Math.random() * 120) + 60 },
        { name: 'drinks', status: 'up', latency: Math.floor(Math.random() * 120) + 60 }
      ],
      timestamp: new Date()
    }).pipe(delay(200));
  }

  /**
   * Exportar datos (simulación)
   */
  exportData(format: 'json' | 'csv' = 'json'): Observable<string> {
    const data = {
      users: this.mockDb.getAllUsers().map(u => ({ ...u, password: '********' })),
      events: this.mockDb.getAllEvents(),
      foods: this.mockDb.getAllFoods(),
      drinks: this.mockDb.getAllDrinks(),
      tickets: this.mockDb.getAllTickets(),
      entries: this.mockDb.getAllEntries(),
      exportedAt: new Date().toISOString()
    };

    let result: string;
    if (format === 'csv') {
      // Simulación simple de CSV
      result = 'data:text/csv;charset=utf-8,';
      result += 'Tipo,Cantidad\n';
      result += `Usuarios,${data.users.length}\n`;
      result += `Eventos,${data.events.length}\n`;
      result += `Comidas,${data.foods.length}\n`;
      result += `Bebidas,${data.drinks.length}\n`;
      result += `Tickets,${data.tickets.length}\n`;
      result += `Entradas,${data.entries.length}`;
    } else {
      result = JSON.stringify(data, null, 2);
    }

    return of(result).pipe(delay(600));
  }

  /**
   * Limpiar datos de prueba (para desarrollo)
   */
  clearTestData(): Observable<boolean> {
    // Reiniciar la base de datos simulada
    // En una implementación real, esto recrearía los datos iniciales
    return of(true).pipe(delay(500));
  }
}