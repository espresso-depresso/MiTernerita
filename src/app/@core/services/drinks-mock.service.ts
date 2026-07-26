import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.developer';
import { catchError, map, Subject, tap, Observable, of } from 'rxjs';
import { MockApiService } from './mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class DrinksMockService {
  private mockApi = inject(MockApiService);
  private refreshDrinks$ = new Subject<void>();
  public refreshDrinksObservable$ = this.refreshDrinks$.asObservable();

  // Obtener todas las bebidas
  getAllDrinks(): Observable<any> {
    return this.mockApi.getAllDrinks().pipe(
      map((drinks: any[]) => {
        // Ordenar por ID descendente como el original
        const sorted = drinks.sort((a: any, b: any) => b.idDrinks - a.idDrinks);
        return sorted.map((drink: any) => ({ ...drink }));
      }),
      catchError((error) => {
        console.error('Error al obtener bebidas de la base de datos simulada:', error);
        return [];
      })
    );
  }

  // Crear bebida
  createDrink(data: any): Observable<any> {
    return this.mockApi.createDrink(data).pipe(
      tap(() => {
        this.refreshDrinks$.next();
        console.log('Bebida creada en base de datos simulada:', data);
      }),
      map((createdDrink) => ({
        ...createdDrink,
        message: 'Bebida creada exitosamente',
        success: true
      })),
      catchError((error) => {
        console.error('Error al crear bebida:', error);
        throw error;
      })
    );
  }

  // Actualizar bebida
  updateDrink(id: number, data: any): Observable<any> {
    return this.mockApi.updateDrink(id, data).pipe(
      tap(() => {
        this.refreshDrinks$.next();
        console.log('Bebida actualizada en base de datos simulada:', id, data);
      }),
      map((updatedDrink) => {
        if (!updatedDrink) {
          throw new Error(`Bebida con ID ${id} no encontrada para actualizar`);
        }
        return {
          ...updatedDrink,
          message: 'Bebida actualizada exitosamente',
          success: true
        };
      }),
      catchError((error) => {
        console.error(`Error al actualizar bebida con ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Actualizar bebida con JSON (mismo que updateDrink para simulación)
  updateDrinkJson(id: number, data: any): Observable<any> {
    return this.updateDrink(id, data).pipe(
      map(response => ({
        ...response,
        message: 'Bebida actualizada con JSON exitosamente'
      }))
    );
  }

  // Eliminar bebida
  deleteDrink(id: number): Observable<any> {
    return this.mockApi.deleteDrink(id).pipe(
      tap(() => {
        this.refreshDrinks$.next();
        console.log('Bebida eliminada de base de datos simulada:', id);
      }),
      map((success) => {
        if (success) {
          return {
            message: 'Bebida eliminada exitosamente',
            success: true
          };
        } else {
          throw new Error(`Bebida con ID ${id} no encontrada para eliminar`);
        }
      }),
      catchError((error) => {
        console.error(`Error al eliminar bebida con ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Métodos adicionales para simulación
  getDrinkById(id: number): Observable<any> {
    return this.mockApi.getDrinkById(id).pipe(
      map(drink => {
        if (!drink) {
          throw new Error(`Bebida con ID ${id} no encontrada`);
        }
        return drink;
      }),
      catchError((error) => {
        console.error(`Error al obtener bebida con ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Obtener bebidas activas
  getActiveDrinks(): Observable<any[]> {
    return this.mockApi.getActiveDrinks().pipe(
      map(drinks => drinks.map(drink => ({ ...drink })))
    );
  }

  // Buscar bebidas
  searchDrinks(searchTerm: string): Observable<any[]> {
    return this.mockApi.getAllDrinks().pipe(
      map(drinks => {
        const searchTermLower = searchTerm.toLowerCase();
        return drinks.filter(drink => 
          drink.description.toLowerCase().includes(searchTermLower)
        );
      })
    );
  }

  // Obtener menú completo (comidas y bebidas)
  getFullMenu(): Observable<{ foods: any[]; drinks: any[] }> {
    return this.mockApi.getHomepageSummary().pipe(
      map(summary => summary.menuHighlights)
    );
  }
}