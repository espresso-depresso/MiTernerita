# Base de Datos Simulada - miTerneritaFront

## Resumen

Se ha implementado una base de datos simulada completa para el sitio web miTerneritaFront. Esta implementación proporciona almacenamiento en memoria para usuarios, eventos, comidas, bebidas, tickets y registros de entrada, permitiendo probar y desarrollar funcionalidades sin necesidad de un backend real.

## Arquitectura

### Servicios Implementados

1. **`MockDatabaseService`** (`mock-database.service.ts`)
   - Base de datos central en memoria
   - Implementa CRUD completo para todas las entidades
   - Incluye datos de prueba iniciales
   - Maneja relaciones entre entidades

2. **`MockEventsService`** (`mock-events.service.ts`)
   - Servicio especializado para eventos
   - Simula llamadas HTTP con delays
   - Métodos para búsqueda y filtrado

3. **`MockAuthService`** (`mock-auth.service.ts`)
   - Servicio de autenticación simulada
   - Manejo de usuarios, login, registro
   - Token JWT simulado

4. **`MockFoodsDrinksService`** (`mock-foods-drinks.service.ts`)
   - Gestión de comidas y bebidas
   - Métodos para menú y categorías
   - Estadísticas de ventas simuladas

5. **`MockApiService`** (`mock-api.service.ts`)
   - Servicio unificado
   - Proporciona acceso a toda la base de datos
   - Métodos para dashboard y estadísticas

### Modelos de Datos

1. **Usuario** (`User`)
   - `idUser`, `name`, `lastName`, `email`, `password`, `phone`
   - `cedulaTipo`, `cedulaNum`, `idRole`, `role`, `access_token`

2. **Evento** (`Event`)
   - `idEvents`, `name`, `description`, `date`, `time`, `capacity`
   - `room`, `flyer`, `image1`, `image2`, `image3`, `status`, `consumo`

3. **Comida** (`Food`)
   - `idFood`, `description`, `price`, `status`, `image`

4. **Bebida** (`Drink`)
   - `idDrinks`, `description`, `price`, `status`, `image`

5. **Ticket** (`Ticket`) - Servicio interno
   - `idTicket`, `idEvent`, `idUser`, `zone`, `price`, `purchaseDate`, `status`

6. **Entrada** (`Entry`) - Servicio interno
   - `idEntry`, `idUser`, `idEvent`, `entryTime`, `exitTime`

## Datos de Prueba Iniciales

### Usuarios (3)
1. **Admin**: Juan Pérez (idRole: 1)
2. **Usuario normal**: María González (idRole: 2)
3. **Usuario normal**: Carlos Rodríguez (idRole: 2)

### Eventos (3)
1. **Fiesta Electrónica**: Próxima semana, capacidad 500
2. **Concierto Rock**: Próximo mes, capacidad 300
3. **Fiesta Latina**: Inactiva, capacidad 400

### Comidas (4)
1. Hamburguesa Clásica - $12.99 (Activa)
2. Pizza Margarita - $15.99 (Activa)
3. Ensalada César - $9.99 (Activa)
4. Tacos Mexicanos - $11.99 (Inactiva)

### Bebidas (4)
1. Cerveza Artesanal - $5.99 (Activa)
2. Cóctel Margarita - $8.99 (Activa)
3. Refresco de Cola - $3.99 (Activa)
4. Agua Mineral - $2.99 (Inactiva)

### Tickets (3)
- 2 tickets para Fiesta Electrónica
- 1 ticket para Concierto Rock

## Integración con la Aplicación

### Componente Home Actualizado

El componente `HomeComponent` ha sido actualizado para:

1. **Mostrar estadísticas del sistema** desde `getDashboardStats()`
2. **Listar eventos próximos** desde `getUpcomingEvents()`
3. **Mostrar menú destacado** desde `getHomepageSummary()`
4. **Verificar estado del sistema** desde `checkSystemStatus()`

### Características Implementadas

1. **Dashboard en tiempo real**: Muestra estadísticas de usuarios, eventos, tickets
2. **Carrusel de eventos**: Usa datos reales de la base de datos simulada
3. **Menú interactivo**: Muestra comidas y bebidas disponibles
4. **Sistema de estado**: Monitorea servicios simulados
5. **Imágenes simuladas**: URLs de imágenes para cada item

## Uso

### Inyectar Servicios

```typescript
import { MockApiService } from './@core/services/mock-api.service';

constructor(private mockApi: MockApiService) {}

// Obtener eventos
this.mockApi.getActiveEvents().subscribe(events => {
  console.log('Eventos activos:', events);
});

// Autenticar usuario
this.mockApi.login('maria@example.com', 'password123').subscribe(user => {
  console.log('Usuario autenticado:', user);
});
```

### Métodos Disponibles

#### Usuarios
- `login(email, password)`
- `register(userData)`
- `getAllUsers()`
- `getUserById(id)`
- `updateUser(id, userData)`
- `deleteUser(id)`

#### Eventos
- `getAllEvents()`
- `getActiveEvents()`
- `getEventById(id)`
- `createEvent(eventData)`
- `updateEvent(id, eventData)`
- `deleteEvent(id)`
- `getUpcomingEvents(limit)`

#### Comidas y Bebidas
- `getAllFoods()`, `getAllDrinks()`
- `getActiveFoods()`, `getActiveDrinks()`
- `getFoodById(id)`, `getDrinkById(id)`
- `createFood(foodData)`, `createDrink(drinkData)`
- `updateFood(id, foodData)`, `updateDrink(id, drinkData)`
- `deleteFood(id)`, `deleteDrink(id)`

#### Dashboard y Estadísticas
- `getDashboardStats()` - Estadísticas generales
- `getHomepageSummary()` - Resumen para página principal
- `checkSystemStatus()` - Estado de servicios
- `exportData(format)` - Exportar datos (JSON/CSV)

## Ventajas

1. **Desarrollo sin backend**: Permite desarrollar frontend sin API real
2. **Datos consistentes**: Siempre disponibles, no dependen de red
3. **Rápido**: Respuestas inmediatas con delays simulados
4. **Fácil de probar**: Datos predefinidos para testing
5. **Escalable**: Fácil de extender con nuevas entidades

## Migración a Backend Real

Cuando se implemente un backend real, se pueden:

1. **Reemplazar servicios**: Sustituir `MockApiService` por servicios reales
2. **Mantener interfaces**: Las interfaces de modelo permanecen iguales
3. **Conservar componentes**: La UI no necesita cambios significativos
4. **Usar como fallback**: Mantener como respaldo si el backend falla

## Personalización

Para agregar más datos de prueba:

```typescript
// En MockDatabaseService
private createInitialUsers(): void {
  this.users.push({
    idUser: this.userIdCounter++,
    name: 'Nuevo Usuario',
    email: 'nuevo@example.com',
    // ... más propiedades
  });
}
```

Para modificar delays de respuesta:

```typescript
// En cualquier servicio mock
return of(data).pipe(delay(500)); // Cambiar 500 por el delay deseado
```

## Solución de Problemas

### No se muestran datos
1. Verificar que los servicios están inyectados correctamente
2. Revisar la consola del navegador para errores
3. Asegurarse que los observables están suscritos

### Errores de tipos
1. Verificar que las interfaces coinciden
2. Revisar importaciones de modelos
3. Asegurar tipos correctos en respuestas

### Imágenes no se cargan
1. Verificar rutas de imágenes en datos de prueba
2. Asegurar que los archivos existen en `assets/img/`
3. Usar imágenes de reemplazo si es necesario

## Próximos Pasos

1. **Agregar más datos**: Expandir datos de prueba
2. **Mejorar UI**: Refinar presentación de datos
3. **Agregar filtros**: Implementar búsqueda avanzada
4. **Dashboard admin**: Extender para panel de administración
5. **Persistencia**: Agregar localStorage para persistencia entre recargas

---

**Estado**: ✅ Implementado y funcionando  
**Última actualización**: Julio 2026  
**Mantenedor**: Sistema de Base de Datos Simulada