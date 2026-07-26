import { Injectable, inject } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Food } from '../models/foods.model';
import { Drink } from '../models/drink.model';
import { MockDatabaseService } from './mock-database.service';

@Injectable({
  providedIn: 'root'
})
export class MockFoodsDrinksService {
  private mockDb = inject(MockDatabaseService);

  // ========== COMIDAS ==========

  /**
   * Obtener todas las comidas
   */
  getAllFoods(): Observable<Food[]> {
    const foods = this.mockDb.getAllFoods();
    return of(foods).pipe(
      delay(300),
      map(foods => foods.map(food => ({
        ...food,
        // Simular URL de imagen
        image: food.image || new File([], 'default_food.jpg')
      })))
    );
  }

  /**
   * Obtener comidas activas
   */
  getActiveFoods(): Observable<Food[]> {
    const foods = this.mockDb.getActiveFoods();
    return of(foods).pipe(
      delay(250),
      map(foods => foods.map(food => ({
        ...food,
        image: food.image || new File([], 'default_food.jpg')
      })))
    );
  }

  /**
   * Obtener comida por ID
   */
  getFoodById(id: number): Observable<Food | undefined> {
    const food = this.mockDb.getFoodById(id);
    return of(food).pipe(
      delay(200),
      map(food => food ? {
        ...food,
        image: food.image || new File([], 'default_food.jpg')
      } : undefined)
    );
  }

  /**
   * Crear nueva comida
   */
  createFood(foodData: Partial<Food>): Observable<Food> {
    const newFood = this.mockDb.createFood(foodData);
    return of(newFood).pipe(
      delay(400),
      map(food => ({
        ...food,
        image: food.image || new File([], 'default_food.jpg')
      }))
    );
  }

  /**
   * Actualizar comida
   */
  updateFood(id: number, foodData: Partial<Food>): Observable<Food | undefined> {
    const updatedFood = this.mockDb.updateFood(id, foodData);
    return of(updatedFood).pipe(
      delay(350),
      map(food => food ? {
        ...food,
        image: food.image || new File([], 'default_food.jpg')
      } : undefined)
    );
  }

  /**
   * Eliminar comida
   */
  deleteFood(id: number): Observable<boolean> {
    const result = this.mockDb.deleteFood(id);
    return of(result).pipe(delay(300));
  }

  /**
   * Buscar comidas por término
   */
  searchFoods(searchTerm: string): Observable<Food[]> {
    const allFoods = this.mockDb.getAllFoods();
    const searchTermLower = searchTerm.toLowerCase();
    
    const filteredFoods = allFoods.filter(food => 
      food.description.toLowerCase().includes(searchTermLower)
    );

    return of(filteredFoods).pipe(
      delay(300),
      map(foods => foods.map(food => ({
        ...food,
        image: food.image || new File([], 'default_food.jpg')
      })))
    );
  }

  /**
   * Obtener comidas por rango de precios
   */
  getFoodsByPriceRange(minPrice: number, maxPrice: number): Observable<Food[]> {
    const allFoods = this.mockDb.getAllFoods();
    
    const filteredFoods = allFoods.filter(food => 
      food.price >= minPrice && food.price <= maxPrice && food.status === 1
    );

    return of(filteredFoods).pipe(
      delay(250),
      map(foods => foods.map(food => ({
        ...food,
        image: food.image || new File([], 'default_food.jpg')
      })))
    );
  }

  // ========== BEBIDAS ==========

  /**
   * Obtener todas las bebidas
   */
  getAllDrinks(): Observable<Drink[]> {
    const drinks = this.mockDb.getAllDrinks();
    return of(drinks).pipe(
      delay(300),
      map(drinks => drinks.map(drink => ({
        ...drink,
        image: drink.image || new File([], 'default_drink.jpg')
      })))
    );
  }

  /**
   * Obtener bebidas activas
   */
  getActiveDrinks(): Observable<Drink[]> {
    const drinks = this.mockDb.getActiveDrinks();
    return of(drinks).pipe(
      delay(250),
      map(drinks => drinks.map(drink => ({
        ...drink,
        image: drink.image || new File([], 'default_drink.jpg')
      })))
    );
  }

  /**
   * Obtener bebida por ID
   */
  getDrinkById(id: number): Observable<Drink | undefined> {
    const drink = this.mockDb.getDrinkById(id);
    return of(drink).pipe(
      delay(200),
      map(drink => drink ? {
        ...drink,
        image: drink.image || new File([], 'default_drink.jpg')
      } : undefined)
    );
  }

  /**
   * Crear nueva bebida
   */
  createDrink(drinkData: Partial<Drink>): Observable<Drink> {
    const newDrink = this.mockDb.createDrink(drinkData);
    return of(newDrink).pipe(
      delay(400),
      map(drink => ({
        ...drink,
        image: drink.image || new File([], 'default_drink.jpg')
      }))
    );
  }

  /**
   * Actualizar bebida
   */
  updateDrink(id: number, drinkData: Partial<Drink>): Observable<Drink | undefined> {
    const updatedDrink = this.mockDb.updateDrink(id, drinkData);
    return of(updatedDrink).pipe(
      delay(350),
      map(drink => drink ? {
        ...drink,
        image: drink.image || new File([], 'default_drink.jpg')
      } : undefined)
    );
  }

  /**
   * Eliminar bebida
   */
  deleteDrink(id: number): Observable<boolean> {
    const result = this.mockDb.deleteDrink(id);
    return of(result).pipe(delay(300));
  }

  /**
   * Buscar bebidas por término
   */
  searchDrinks(searchTerm: string): Observable<Drink[]> {
    const allDrinks = this.mockDb.getAllDrinks();
    const searchTermLower = searchTerm.toLowerCase();
    
    const filteredDrinks = allDrinks.filter(drink => 
      drink.description.toLowerCase().includes(searchTermLower)
    );

    return of(filteredDrinks).pipe(
      delay(300),
      map(drinks => drinks.map(drink => ({
        ...drink,
        image: drink.image || new File([], 'default_drink.jpg')
      })))
    );
  }

  /**
   * Obtener bebidas por rango de precios
   */
  getDrinksByPriceRange(minPrice: number, maxPrice: number): Observable<Drink[]> {
    const allDrinks = this.mockDb.getAllDrinks();
    
    const filteredDrinks = allDrinks.filter(drink => 
      drink.price >= minPrice && drink.price <= maxPrice && drink.status === 1
    );

    return of(filteredDrinks).pipe(
      delay(250),
      map(drinks => drinks.map(drink => ({
        ...drink,
        image: drink.image || new File([], 'default_drink.jpg')
      })))
    );
  }

  // ========== MÉTODOS COMBINADOS ==========

  /**
   * Obtener menú completo (comidas y bebidas activas)
   */
  getFullMenu(): Observable<{ foods: Food[]; drinks: Drink[] }> {
    const foods = this.mockDb.getActiveFoods();
    const drinks = this.mockDb.getActiveDrinks();

    return of({ foods, drinks }).pipe(
      delay(400),
      map(({ foods, drinks }) => ({
        foods: foods.map(food => ({
          ...food,
          image: food.image || new File([], 'default_food.jpg')
        })),
        drinks: drinks.map(drink => ({
          ...drink,
          image: drink.image || new File([], 'default_drink.jpg')
        }))
      }))
    );
  }

  /**
   * Obtener items por categoría
   */
  getItemsByCategory(category: 'food' | 'drink'): Observable<(Food | Drink)[]> {
    if (category === 'food') {
      const foods = this.mockDb.getActiveFoods();
      return of(foods).pipe(
        delay(300),
        map(foods => foods.map(food => ({
          ...food,
          image: food.image || new File([], 'default_food.jpg'),
          type: 'food' as const
        })))
      );
    } else {
      const drinks = this.mockDb.getActiveDrinks();
      return of(drinks).pipe(
        delay(300),
        map(drinks => drinks.map(drink => ({
          ...drink,
          image: drink.image || new File([], 'default_drink.jpg'),
          type: 'drink' as const
        })))
      );
    }
  }

  /**
   * Obtener items más vendidos (simulación)
   */
  getTopSellingItems(limit: number = 5): Observable<Array<Food | Drink & { sales: number }>> {
    // Simular datos de ventas
    const topItems = [
      { ...this.mockDb.getFoodById(1)!, sales: 150, type: 'food' as const },
      { ...this.mockDb.getDrinkById(1)!, sales: 120, type: 'drink' as const },
      { ...this.mockDb.getFoodById(2)!, sales: 95, type: 'food' as const },
      { ...this.mockDb.getDrinkById(2)!, sales: 85, type: 'drink' as const },
      { ...this.mockDb.getFoodById(3)!, sales: 70, type: 'food' as const }
    ].slice(0, limit);

    return of(topItems).pipe(
      delay(350),
      map(items => items.map(item => ({
        ...item,
        image: item.image || new File([], 'default.jpg')
      })))
    );
  }

  /**
   * Obtener estadísticas de ventas (simulación)
   */
  getSalesStatistics(): Observable<any> {
    const foods = this.mockDb.getAllFoods();
    const drinks = this.mockDb.getAllDrinks();
    
    const totalItems = foods.length + drinks.length;
    const activeItems = foods.filter(f => f.status === 1).length + 
                       drinks.filter(d => d.status === 1).length;
    
    const averageFoodPrice = foods.length > 0 
      ? foods.reduce((sum, food) => sum + food.price, 0) / foods.length 
      : 0;
    
    const averageDrinkPrice = drinks.length > 0 
      ? drinks.reduce((sum, drink) => sum + drink.price, 0) / drinks.length 
      : 0;

    return of({
      totalItems,
      activeItems,
      inactiveItems: totalItems - activeItems,
      averageFoodPrice: parseFloat(averageFoodPrice.toFixed(2)),
      averageDrinkPrice: parseFloat(averageDrinkPrice.toFixed(2)),
      totalCategories: 2, // food y drink
      mostExpensiveFood: foods.length > 0 
        ? Math.max(...foods.map(f => f.price)) 
        : 0,
      mostExpensiveDrink: drinks.length > 0 
        ? Math.max(...drinks.map(d => d.price)) 
        : 0
    }).pipe(delay(400));
  }
}