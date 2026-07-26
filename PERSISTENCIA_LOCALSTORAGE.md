# Persistencia en localStorage - Implementación

## Resumen

Se ha implementado persistencia de datos en localStorage para la base de datos simulada. Los datos ahora se guardan localmente y persisten después de refrescar la página.

## Archivos Creados/Modificados

### Archivos Nuevos (2)

1. **`src/app/@core/services/storage.service.ts`**
   - Servicio centralizado para gestión de localStorage
   - Métodos para guardar, obtener y eliminar datos
   - Tipado seguro con generics
   - Manejo de errores

2. **`src/app/@core/services/mock-database.service.ts`** (completamente reescrito)
   - Base de datos simulada con persistencia en localStorage
   - Métodos CRUD para todas las entidades
   - Inicialización automática de datos de prueba si no hay datos guardados

### Archivos Modificados (2)

1. **`src/app/app.config.ts`**
   - Reemplazado AuthService por AuthMockService
   - Reemplazado EventsService por EventsMockService
   - Reemplazado TicketsService por TicketsMockService
   - Reemplazado FoodsService por FoodsMockService
   - Reemplazado DrinksService por DrinksMockService

2. **`src/app/@core/layout/layout.component.html`**
   - Botones de Login y Register visibles cuando no hay usuario logueado
   - Botón de Logout y nombre de usuario visibles cuando hay usuario logueado

## Claves de localStorage

Los datos se guardan con las siguientes claves:

| Clave | Datos |
|-------|-------|
| `mock_users` | Array de usuarios |
| `mock_events` | Array de eventos |
| `mock_foods` | Array de comidas |
| `mock_drinks` | Array de bebidas |
| `mock_tickets` | Array de tickets |
| `mock_entries` | Array de entradas |
| `mock_user_counter` | Contador para IDs de usuarios |
| `mock_event_counter` | Contador para IDs de eventos |
| `mock_food_counter` | Contador para IDs de comidas |
| `mock_drink_counter` | Contador para IDs de bebidas |
| `mock_ticket_counter` | Contador para IDs de tickets |
| `mock_entry_counter` | Contador para IDs de entradas |
| `mock_ticket_zones` | Zonas disponibles para tickets |

## Cómo Funciona

### Inicialización
1. Al iniciar la aplicación, `MockDatabaseService` carga datos de localStorage
2. Si no hay datos, inicializa con datos de prueba por defecto
3. Todos los datos se guardan automáticamente en localStorage

### Operaciones CRUD
- **CREATE**: Guarda datos en localStorage automáticamente
- **READ**: Lee datos de localStorage
- **UPDATE**: Actualiza datos en localStorage
- **DELETE**: Elimina datos de localStorage

### Tokens de Autenticación
- El token se guarda en: `localStorage.getItem('token_mock')`
- Los datos del usuario se guardan en: `localStorage.getItem('user_mock')`

## Cómo Limpiar los Datos

Puedes limpiar todos los datos de localStorage usando:

```typescript
import { MockDatabaseService } from './@core/services/mock-database.service';

constructor(private mockDb: MockDatabaseService) {}

// Restaurar datos por defecto
this.mockDb.restoreDefaultData();
```

O limpiar manualmente desde la consola del navegador:

```javascript
// Limpiar todos los datos de la base de datos simulada
localStorage.removeItem('mock_users');
localStorage.removeItem('mock_events');
localStorage.removeItem('mock_foods');
localStorage.removeItem('mock_drinks');
localStorage.removeItem('mock_tickets');
localStorage.removeItem('mock_entries');
localStorage.removeItem('mock_user_counter');
localStorage.removeItem('mock_event_counter');
localStorage.removeItem('mock_food_counter');
localStorage.removeItem('mock_drink_counter');
localStorage.removeItem('mock_ticket_counter');
localStorage.removeItem('mock_entry_counter');
localStorage.removeItem('mock_ticket_zones');
localStorage.removeItem('token_mock');
localStorage.removeItem('user_mock');
```

## Datos por Defecto

### Usuarios (3)
1. **Admin**: Juan Pérez (juan@example.com / password123)
2. **Usuario**: María González (maria@example.com / password123)
3. **Usuario**: Carlos Rodríguez (carlos@example.com / password123)

### Eventos (3)
1. **Fiesta Electrónica** - Activo
2. **Concierto Rock** - Activo
3. **Fiesta Latina** - Inactivo

### Comidas (4)
1. **Hamburguesa Clásica** - Activa
2. **Pizza Margarita** - Activa
3. **Ensalada César** - Activa
4. **Tacos Mexicanos** - Inactiva

### Bebidas (4)
1. **Cerveza Artesanal** - Activa
2. **Cóctel Margarita** - Activa
3. **Refresco de Cola** - Activa
4. **Agua Mineral** - Inactiva

## Ventajas

1. **Persistencia**: Los datos persisten después de refrescar la página
2. **Independencia**: No depende de un backend externo
3. **Velocidad**: Respuestas inmediatas desde localStorage
4. **Desarrollo**: Perfecto para desarrollo y testing
5. **Demostración**: Puedes demostrar la aplicación sin servidor

## Migración Futura a Backend

Cuando implementes un backend real:

1. Reemplaza los servicios mock por servicios reales
2. Los métodos de `StorageService` pueden mantenerse para caché local
3. Opcional: Implementa sincronización bidireccional

## Verificación

Para verificar que los datos se están guardando en localStorage:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña Application
3. En el panel izquierdo, selecciona "Local Storage"
4. Verás las claves `mock_*` con los datos guardados

Para ver los datos:
```javascript
// Ver todos los datos de usuarios
JSON.parse(localStorage.getItem('mock_users'));

// Ver todos los datos de eventos
JSON.parse(localStorage.getItem('mock_events'));

// Ver contadores
JSON.parse(localStorage.getItem('mock_user_counter'));
```

---

**Estado**: ✅ Implementación Completada  
**Fecha**: Julio 2026  
**Persistencia**: localStorage activa  
**Datos iniciales**: 3 usuarios, 3 eventos, 4 comidas, 4 bebidas