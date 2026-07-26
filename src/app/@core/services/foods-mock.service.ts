import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.developer';
import { Subject, tap, Observable, of, map, catchError } from 'rxjs';
import { MockApiService } from './mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class FoodsMockService {
  private mockApi = inject(MockApiService);
  private refreshFoods$ = new Subject<void>();
  public refreshFoodsObservable$ = this.refreshFoods$.asObservable();

  // Obtener todas las comidas
  getAllFoods(): Observable<any> {
    return this.mockApi.getAllFoods().pipe(
      map((foods: any[]) => {
        // Ordenar por ID descendente como el original
        return foods.sort((a: any, b: any) => b.idFood - a.idFood)
          .map((food: any) => ({ ...food }));
      }),
      catchError((error) => {
        console.error('Error al obtener comidas de la base de datos simulada:', error);
        return [];
      })
    );
  }

  // Crear comida
  createFood(data: any): Observable<any> {
    return this.mockApi.createFood(data).pipe(
      tap(() => {
        this.refreshFoods$.next();
        console.log('Comida creada en base de datos simulada:', data);
      }),
      map((createdFood) => ({
        ...createdFood,
        message: 'Comida creada exitosamente',
        success: true
      })),
      catchError((error) => {
        console.error('Error al crear comida:', error);
        throw error;
      })
    );
  }

  // Actualizar comida
  updateFood(idFoods: number, data: any): Observable<any> {
    return this.mockApi.updateFood(idFoods, data).pipe(
      tap(() => {
        this.refreshFoods$.next();
        console.log('Comida actualizada en base de datos simulada:', idFoods, data);
      }),
      map((updatedFood) => {
        if (!updatedFood) {
          throw new Error(`Comida con ID ${idFoods} no encontrada para actualizar`);
        }
        return {
          ...updatedFood,
          message: 'Comida actualizada exitosamente',
          success: true
        };
      }),
      catchError((error) => {
        console.error(`Error al actualizar comida con ID ${idFoods}:`, error);
        throw error;
      })
    );
  }

  // Actualizar comida con JSON (mismo que updateFood para simulación)
  updateFoodJson(idFoods: number, data: any): Observable<any> {
    return this.updateFood(idFoods, data).pipe(
      map(response => ({
        ...response,
        message: 'Comida actualizada con JSON exitosamente'
      }))
    );
  }

  // Eliminar comida
  deleteFood(idFood: number): Observable<any> {
    return this.mockApi.deleteFood(idFood).pipe(
      tap(() => {
        this.refreshFoods$.next();
        console.log('Comida eliminada de base de datos simulada:', idFood);
      }),
      map((success) => {
        if (success) {
          return {
            message: 'Comida eliminada exitosamente',
            success: true
          };
        } else {
          throw new Error(`Comida con ID ${idFood} no encontrada para eliminar`);
        }
      }),
      catchError((error) => {
        console.error(`Error al eliminar comida con ID ${idFood}:`, error);
        throw error;
      })
    );
  }

  // Métodos adicionales para simulación
  getFoodById(id: number): Observable<any> {
    return this.mockApi.getFoodById(id).pipe(
      map(food => {
        if (!food) {
          throw new Error(`Comida con ID ${id} no encontrada`);
        }
        return food;
      }),
      catchError((error) => {
        console.error(`Error al obtener comida con ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Obtener comidas activas
  getActiveFoods(): Observable<any[]> {
    return this.mockApi.getActiveFoods().pipe(
      map(foods => foods.map(food => ({ ...food })))
    );
  }

  // Buscar comidas
  searchFoods(searchTerm: string): Observable<any[]> {
    return this.mockApi.getAllFoods().pipe(
      map(foods => {
        const searchTermLower = searchTerm.toLowerCase();
        return foods.filter(food => 
          food.description.toLowerCase().includes(searchTermLower)
        );
      })
    );
  }
}