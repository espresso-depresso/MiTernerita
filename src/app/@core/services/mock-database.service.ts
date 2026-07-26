import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Event } from '../models/event.model';
import { Food } from '../models/foods.model';
import { Drink } from '../models/drink.model';
import { StorageService } from './storage.service';

export interface Ticket {
  idTicket: number;
  idEvent: number;
  idUser: number;
  zone: string;
  price: number;
  purchaseDate: Date;
  status: string;
}

export interface Entry {
  idEntry: number;
  idUser: number;
  idEvent: number;
  entryTime: Date;
  exitTime?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MockDatabaseService {
  constructor(private storageService: StorageService) {
    this.loadFromStorage();
  }

  // ========== USUARIOS ==========
  getAllUsers(): User[] {
    return this.storageService.get<User[]>(this.storageService.STORAGE_KEYS.USERS) || [];
  }

  getUserById(id: number): User | undefined {
    const users = this.getAllUsers();
    return users.find(user => user.idUser === id);
  }

  getUserByEmail(email: string): User | undefined {
    const users = this.getAllUsers();
    return users.find(user => user.email === email);
  }

  createUser(userData: Partial<User>): User {
    const users = this.getAllUsers();
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const newUser: User = {
      idUser: (this.storageService.get<number>(this.storageService.STORAGE_KEYS.USER_COUNTER) || 1),
      cedulaTipo: userData.cedulaTipo || 'V',
      cedulaNum: userData.cedulaNum || '',
      name: userData.name || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      password: userData.password || '',
      phone: userData.phone || '',
      idRole: userData.idRole || 2,
      role: (userData.role || 'user').toString().toLowerCase(),
      access_token: `mock_token_${Date.now()}`
    };

    const newCounter = (this.storageService.get<number>(this.storageService.STORAGE_KEYS.USER_COUNTER) || 1) + 1;
    this.storageService.save(this.storageService.STORAGE_KEYS.USER_COUNTER, newCounter);
    newUser.idUser = newCounter - 1;

    users.push(newUser);
    this.storageService.saveUsers(users);
    return newUser;
  }

  updateUser(id: number, userData: Partial<User>): User | undefined {
    const users = this.getAllUsers();
    const index = users.findIndex(user => user.idUser === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      this.storageService.saveUsers(users);
      return users[index];
    }
    return undefined;
  }

  deleteUser(id: number): boolean {
    const users = this.getAllUsers();
    const initialLength = users.length;
    const filteredUsers = users.filter(user => user.idUser !== id);
    const deleted = filteredUsers.length < initialLength;
    if (deleted) {
      this.storageService.saveUsers(filteredUsers);
    }
    return deleted;
  }

  authenticate(email: string, password: string): User | undefined {
    const users = this.getAllUsers();
    return users.find(user => user.email === email && user.password === password);
  }

  // ========== EVENTOS ==========
  getAllEvents(): Event[] {
    return this.storageService.get<Event[]>(this.storageService.STORAGE_KEYS.EVENTS) || [];
  }

  getActiveEvents(): Event[] {
    const events = this.getAllEvents();
    return events.filter(event => event.status === 1);
  }

  getEventById(id: number): Event | undefined {
    const events = this.getAllEvents();
    return events.find(event => event.idEvents === id);
  }

  createEvent(eventData: Partial<Event>): Event {
    const events = this.getAllEvents();
    const newEvent: Event = {
      idEvents: (this.storageService.get<number>(this.storageService.STORAGE_KEYS.EVENT_COUNTER) || 1),
      name: eventData.name || '',
      description: eventData.description || '',
      date: eventData.date || new Date(),
      time: eventData.time || '20:00:00',
      capacity: eventData.capacity || 100,
      room: eventData.room || 'Salón Principal',
      flyer: eventData.flyer || 'assets/img/default.jpg',
      image1: eventData.image1 || 'assets/img/default1.jpg',
      image2: eventData.image2 || 'assets/img/default2.jpg',
      image3: eventData.image3 || 'assets/img/default3.jpg',
      status: eventData.status || 1,
      consumo: 0
    };

    const newCounter = (this.storageService.get<number>(this.storageService.STORAGE_KEYS.EVENT_COUNTER) || 1) + 1;
    this.storageService.save(this.storageService.STORAGE_KEYS.EVENT_COUNTER, newCounter);
    newEvent.idEvents = newCounter - 1;

    events.push(newEvent);
    this.storageService.saveEvents(events);
    return newEvent;
  }

  updateEvent(id: number, eventData: Partial<Event>): Event | undefined {
    const events = this.getAllEvents();
    const index = events.findIndex(event => event.idEvents === id);
    if (index !== -1) {
      events[index] = { ...events[index], ...eventData };
      this.storageService.saveEvents(events);
      return events[index];
    }
    return undefined;
  }

  deleteEvent(id: number): boolean {
    const events = this.getAllEvents();
    const initialLength = events.length;
    const filteredEvents = events.filter(event => event.idEvents !== id);
    const deleted = filteredEvents.length < initialLength;
    if (deleted) {
      this.storageService.saveEvents(filteredEvents);
    }
    return deleted;
  }

  // ========== COMIDAS ==========
  getAllFoods(): Food[] {
    return this.storageService.get<Food[]>(this.storageService.STORAGE_KEYS.FOODS) || [];
  }

  getActiveFoods(): Food[] {
    const foods = this.getAllFoods();
    return foods.filter(food => food.status === 1);
  }

  getFoodById(id: number): Food | undefined {
    const foods = this.getAllFoods();
    return foods.find(food => food.idFood === id);
  }

  createFood(foodData: Partial<Food>): Food {
    const foods = this.getAllFoods();
    const newFood: Food = {
      idFood: (this.storageService.get<number>(this.storageService.STORAGE_KEYS.FOOD_COUNTER) || 1),
      description: foodData.description || '',
      price: foodData.price || 0,
      status: foodData.status || 1,
      image: foodData.image || new File([], 'default.jpg')
    };

    const newCounter = (this.storageService.get<number>(this.storageService.STORAGE_KEYS.FOOD_COUNTER) || 1) + 1;
    this.storageService.save(this.storageService.STORAGE_KEYS.FOOD_COUNTER, newCounter);
    newFood.idFood = newCounter - 1;

    foods.push(newFood);
    this.storageService.saveFoods(foods);
    return newFood;
  }

  updateFood(id: number, foodData: Partial<Food>): Food | undefined {
    const foods = this.getAllFoods();
    const index = foods.findIndex(food => food.idFood === id);
    if (index !== -1) {
      foods[index] = { ...foods[index], ...foodData };
      this.storageService.saveFoods(foods);
      return foods[index];
    }
    return undefined;
  }

  deleteFood(id: number): boolean {
    const foods = this.getAllFoods();
    const initialLength = foods.length;
    const filteredFoods = foods.filter(food => food.idFood !== id);
    const deleted = filteredFoods.length < initialLength;
    if (deleted) {
      this.storageService.saveFoods(filteredFoods);
    }
    return deleted;
  }

  // ========== BEBIDAS ==========
  getAllDrinks(): Drink[] {
    return this.storageService.get<Drink[]>(this.storageService.STORAGE_KEYS.DRINKS) || [];
  }

  getActiveDrinks(): Drink[] {
    const drinks = this.getAllDrinks();
    return drinks.filter(drink => drink.status === 1);
  }

  getDrinkById(id: number): Drink | undefined {
    const drinks = this.getAllDrinks();
    return drinks.find(drink => drink.idDrinks === id);
  }

  createDrink(drinkData: Partial<Drink>): Drink {
    const drinks = this.getAllDrinks();
    const newDrink: Drink = {
      idDrinks: (this.storageService.get<number>(this.storageService.STORAGE_KEYS.DRINK_COUNTER) || 1),
      description: drinkData.description || '',
      price: drinkData.price || 0,
      status: drinkData.status || 1,
      image: drinkData.image || new File([], 'default.jpg')
    };

    const newCounter = (this.storageService.get<number>(this.storageService.STORAGE_KEYS.DRINK_COUNTER) || 1) + 1;
    this.storageService.save(this.storageService.STORAGE_KEYS.DRINK_COUNTER, newCounter);
    newDrink.idDrinks = newCounter - 1;

    drinks.push(newDrink);
    this.storageService.saveDrinks(drinks);
    return newDrink;
  }

  updateDrink(id: number, drinkData: Partial<Drink>): Drink | undefined {
    const drinks = this.getAllDrinks();
    const index = drinks.findIndex(drink => drink.idDrinks === id);
    if (index !== -1) {
      drinks[index] = { ...drinks[index], ...drinkData };
      this.storageService.saveDrinks(drinks);
      return drinks[index];
    }
    return undefined;
  }

  deleteDrink(id: number): boolean {
    const drinks = this.getAllDrinks();
    const initialLength = drinks.length;
    const filteredDrinks = drinks.filter(drink => drink.idDrinks !== id);
    const deleted = filteredDrinks.length < initialLength;
    if (deleted) {
      this.storageService.saveDrinks(filteredDrinks);
    }
    return deleted;
  }

  // ========== TICKETS ==========
  getAllTickets(): Ticket[] {
    return this.storageService.get<Ticket[]>(this.storageService.STORAGE_KEYS.TICKETS) || [];
  }

  getTicketsByUserId(userId: number): Ticket[] {
    const tickets = this.getAllTickets();
    return tickets.filter(ticket => ticket.idUser === userId);
  }

  getTicketsByEventId(eventId: number): Ticket[] {
    const tickets = this.getAllTickets();
    return tickets.filter(ticket => ticket.idEvent === eventId);
  }

  getTicketById(id: number): Ticket | undefined {
    const tickets = this.getAllTickets();
    return tickets.find(ticket => ticket.idTicket === id);
  }

  createTicket(ticketData: Partial<Ticket>): Ticket {
    const tickets = this.getAllTickets();
    const newTicket: Ticket = {
      idTicket: (this.storageService.get<number>(this.storageService.STORAGE_KEYS.TICKET_COUNTER) || 1),
      idEvent: ticketData.idEvent || 0,
      idUser: ticketData.idUser || 0,
      zone: ticketData.zone || 'General',
      price: ticketData.price || 0,
      purchaseDate: ticketData.purchaseDate || new Date(),
      status: ticketData.status || 'active'
    };

    const newCounter = (this.storageService.get<number>(this.storageService.STORAGE_KEYS.TICKET_COUNTER) || 1) + 1;
    this.storageService.save(this.storageService.STORAGE_KEYS.TICKET_COUNTER, newCounter);
    newTicket.idTicket = newCounter - 1;

    tickets.push(newTicket);
    this.storageService.saveTickets(tickets);
    return newTicket;
  }

  // ========== ENTRADAS ==========
  getAllEntries(): Entry[] {
    return this.storageService.get<Entry[]>(this.storageService.STORAGE_KEYS.ENTRIES) || [];
  }

  getEntriesByEventId(eventId: number): Entry[] {
    const entries = this.getAllEntries();
    return entries.filter(entry => entry.idEvent === eventId);
  }

  getEntriesByUserId(userId: number): Entry[] {
    const entries = this.getAllEntries();
    return entries.filter(entry => entry.idUser === userId);
  }

  getActiveEntriesByEventId(eventId: number): Entry[] {
    const entries = this.getAllEntries();
    return entries.filter(entry => entry.idEvent === eventId && !entry.exitTime);
  }

  createEntry(entryData: Partial<Entry>): Entry {
    const entries = this.getAllEntries();
    const newEntry: Entry = {
      idEntry: (this.storageService.get<number>(this.storageService.STORAGE_KEYS.ENTRY_COUNTER) || 1),
      idUser: entryData.idUser || 0,
      idEvent: entryData.idEvent || 0,
      entryTime: entryData.entryTime || new Date(),
      exitTime: entryData.exitTime
    };

    const newCounter = (this.storageService.get<number>(this.storageService.STORAGE_KEYS.ENTRY_COUNTER) || 1) + 1;
    this.storageService.save(this.storageService.STORAGE_KEYS.ENTRY_COUNTER, newCounter);
    newEntry.idEntry = newCounter - 1;

    entries.push(newEntry);
    this.storageService.saveEntries(entries);
    return newEntry;
  }

  updateEntry(id: number, entryData: Partial<Entry>): Entry | undefined {
    const entries = this.getAllEntries();
    const index = entries.findIndex(entry => entry.idEntry === id);
    if (index !== -1) {
      entries[index] = { ...entries[index], ...entryData };
      this.storageService.saveEntries(entries);
      return entries[index];
    }
    return undefined;
  }

  // ========== ESTADÍSTICAS ==========
  getEventStatistics(eventId: number): any {
    const event = this.getEventById(eventId);
    if (!event) return null;

    const tickets = this.getTicketsByEventId(eventId);
    const entries = this.getEntriesByEventId(eventId);
    const activeEntries = this.getActiveEntriesByEventId(eventId);

    return {
      eventName: event.name,
      capacity: event.capacity,
      ticketsSold: tickets.length,
      entriesCount: entries.length,
      activeEntries: activeEntries.length,
      occupancyRate: event.capacity > 0 ? (activeEntries.length / event.capacity) * 100 : 0
    };
  }

  getUserStatistics(userId: number): any {
    const user = this.getUserById(userId);
    if (!user) return null;

    const tickets = this.getTicketsByUserId(userId);
    const entries = this.getEntriesByUserId(userId);

    return {
      userName: `${user.name} ${user.lastName}`,
      totalTickets: tickets.length,
      totalEntries: entries.length,
      totalSpent: tickets.reduce((sum, ticket) => sum + ticket.price, 0),
      favoriteEvents: this.getFavoriteEvents(userId)
    };
  }

  private getFavoriteEvents(userId: number): number[] {
    const ticketCount: { [eventId: number]: number } = {};
    const userTickets = this.getTicketsByUserId(userId);
    
    userTickets.forEach(ticket => {
      ticketCount[ticket.idEvent] = (ticketCount[ticket.idEvent] || 0) + 1;
    });

    return Object.entries(ticketCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([eventId]) => parseInt(eventId));
  }

  // ========== ZONAS DE TICKETS ==========
  getTicketZones(): any[] {
    return this.storageService.get<any[]>(this.storageService.STORAGE_KEYS.TICKET_ZONES) || [
      { id: 1, name: 'VIP', price: 50.00, description: 'Zona VIP con asientos preferenciales' },
      { id: 2, name: 'General', price: 30.00, description: 'Zona general con vista completa' },
      { id: 3, name: 'Económico', price: 20.00, description: 'Zona económica' },
      { id: 4, name: 'Palco', price: 75.00, description: 'Palco privado' },
      { id: 5, name: 'Platea', price: 40.00, description: 'Platea central' }
    ];
  }

  getZonesByEventId(eventId: number): any[] {
    const zones = this.getTicketZones();
    return zones.map(zone => ({
      ...zone,
      idTicket: zone.id,
      idEvent: eventId,
      status: 'available'
    }));
  }

  // ========== DATOS INICIALES ==========
  private initializeMockData(): void {
    this.createInitialUsers();
    this.createInitialEvents();
    this.createInitialFoods();
    this.createInitialDrinks();
    this.createInitialTickets();
    this.createTicketZones();
    this.createInitialEntries();
  }

  private createInitialUsers(): void {
    const users: User[] = [
      {
        idUser: 1,
        cedulaTipo: 'V',
        cedulaNum: '12345678',
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        password: 'password123',
        phone: '04121234567',
        idRole: 1,
        role: 'admin',
        access_token: 'mock_token_admin'
      },
      {
        idUser: 2,
        cedulaTipo: 'V',
        cedulaNum: '87654321',
        name: 'María',
        lastName: 'González',
        email: 'maria@example.com',
        password: 'password123',
        phone: '04129876543',
        idRole: 2,
        role: 'user',
        access_token: 'mock_token_user'
      },
      {
        idUser: 3,
        cedulaTipo: 'V',
        cedulaNum: '11223344',
        name: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos@example.com',
        password: 'password123',
        phone: '04121122334',
        idRole: 2,
        role: 'user',
        access_token: 'mock_token_user2'
      }
    ];
    this.storageService.saveUsers(users);
    this.storageService.save(this.storageService.STORAGE_KEYS.USER_COUNTER, 4);
  }

  private createInitialEvents(): void {
    // Verificar si ya hay eventos en localStorage
    const existingEvents = this.storageService.get<Event[]>(this.storageService.STORAGE_KEYS.EVENTS);
    if (existingEvents && existingEvents.length > 0) return;

    const events: Event[] = [
      {
        idEvents: 1,
        name: 'Fiesta Electrónica',
        description: 'La mejor fiesta electrónica de la ciudad con DJs internacionales',
        date: new Date(),
        time: '22:00:00',
        capacity: 500,
        room: 'Salón Principal',
        flyer: 'assets/img/evento.jpg',
        image1: 'assets/img/evento.jpg',
        image2: 'assets/img/evento.jpg',
        image3: 'assets/img/evento.jpg',
        status: 1,
        consumo: 0
      },
      {
        idEvents: 2,
        name: 'Concierto Rock',
        description: 'Concierto de rock alternativo con bandas locales',
        date: new Date(),
        time: '20:00:00',
        capacity: 300,
        room: 'Salón Secundario',
        flyer: 'assets/img/eventoig.jpeg',
        image1: 'assets/img/eventoig.jpeg',
        image2: 'assets/img/eventoig.jpeg',
        image3: 'assets/img/eventoig.jpeg',
        status: 1,
        consumo: 0
      },
      {
        idEvents: 3,
        name: 'Fiesta Latina',
        description: 'Fiesta latina con salsa, merengue y bachata',
        date: new Date(),
        time: '21:00:00',
        capacity: 400,
        room: 'Salón Tropical',
        flyer: 'assets/img/evento1.jpg',
        image1: 'assets/img/evento1.jpg',
        image2: 'assets/img/evento1.jpg',
        image3: 'assets/img/evento1.jpg',
        status: 0,
        consumo: 0
      }
    ];
    this.storageService.saveEvents(events);
    this.storageService.save(this.storageService.STORAGE_KEYS.EVENT_COUNTER, 4);
  }

  private createInitialFoods(): void {
    const foods: Food[] = [
      {
        idFood: 1,
        description: 'Hamburguesa Clásica',
        price: 12.99,
        status: 1,
        image: new File([], 'hamburguesa.jpg')
      },
      {
        idFood: 2,
        description: 'Pizza Margarita',
        price: 15.99,
        status: 1,
        image: new File([], 'pizza.jpg')
      },
      {
        idFood: 3,
        description: 'Ensalada César',
        price: 9.99,
        status: 1,
        image: new File([], 'ensalada.jpg')
      },
      {
        idFood: 4,
        description: 'Tacos Mexicanos',
        price: 11.99,
        status: 0,
        image: new File([], 'tacos.jpg')
      }
    ];
    this.storageService.saveFoods(foods);
    this.storageService.save(this.storageService.STORAGE_KEYS.FOOD_COUNTER, 5);
  }

  private createInitialDrinks(): void {
    const drinks: Drink[] = [
      {
        idDrinks: 1,
        description: 'Cerveza Artesanal',
        price: 5.99,
        status: 1,
        image: new File([], 'cerveza.jpg')
      },
      {
        idDrinks: 2,
        description: 'Cóctel Margarita',
        price: 8.99,
        status: 1,
        image: new File([], 'margarita.jpg')
      },
      {
        idDrinks: 3,
        description: 'Refresco de Cola',
        price: 3.99,
        status: 1,
        image: new File([], 'refresco.jpg')
      },
      {
        idDrinks: 4,
        description: 'Agua Mineral',
        price: 2.99,
        status: 0,
        image: new File([], 'agua.jpg')
      }
    ];
    this.storageService.saveDrinks(drinks);
    this.storageService.save(this.storageService.STORAGE_KEYS.DRINK_COUNTER, 5);
  }

  private createInitialTickets(): void {
    const tickets: Ticket[] = [
      {
        idTicket: 1,
        idEvent: 1,
        idUser: 2,
        zone: 'VIP',
        price: 50.00,
        purchaseDate: new Date(),
        status: 'active'
      },
      {
        idTicket: 2,
        idEvent: 1,
        idUser: 3,
        zone: 'General',
        price: 30.00,
        purchaseDate: new Date(),
        status: 'active'
      },
      {
        idTicket: 3,
        idEvent: 2,
        idUser: 2,
        zone: 'General',
        price: 25.00,
        purchaseDate: new Date(),
        status: 'active'
      }
    ];
    this.storageService.saveTickets(tickets);
    this.storageService.save(this.storageService.STORAGE_KEYS.TICKET_COUNTER, 4);
  }

  private createTicketZones(): void {
    const zones = [
      { id: 1, name: 'VIP', price: 50.00, description: 'Zona VIP con asientos preferenciales' },
      { id: 2, name: 'General', price: 30.00, description: 'Zona general con vista completa' },
      { id: 3, name: 'Económico', price: 20.00, description: 'Zona económica' },
      { id: 4, name: 'Palco', price: 75.00, description: 'Palco privado' },
      { id: 5, name: 'Platea', price: 40.00, description: 'Platea central' }
    ];
    this.storageService.saveTicketZones(zones);
  }

  private createInitialEntries(): void {
    const now = new Date();
    const entries: Entry[] = [
      {
        idEntry: 1,
        idUser: 2,
        idEvent: 1,
        entryTime: new Date(now.getTime() - 3600000),
        exitTime: undefined
      },
      {
        idEntry: 2,
        idUser: 3,
        idEvent: 1,
        entryTime: new Date(now.getTime() - 3000000),
        exitTime: undefined
      }
    ];
    this.storageService.saveEntries(entries);
    this.storageService.save(this.storageService.STORAGE_KEYS.ENTRY_COUNTER, 3);
  }

  // Cargar datos desde localStorage
  private loadFromStorage(): void {
    const users = this.storageService.get<User[]>(this.storageService.STORAGE_KEYS.USERS);
    if (!users) {
      this.initializeMockData();
    }
  }

  // Restaurar datos por defecto
  restoreDefaultData(): void {
    this.storageService.clearAll();
    this.initializeMockData();
    console.log('Datos por defecto restaurados');
  }
}