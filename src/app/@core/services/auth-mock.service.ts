import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.developer';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { tap, map, Observable, of, throwError } from 'rxjs';
import { MockApiService } from './mock-api.service';
import { MockDatabaseService } from './mock-database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthMockService {
  private mockApi = inject(MockApiService);
  private mockDb = inject(MockDatabaseService);
  
  private token = signal<string | null>(localStorage.getItem('token') || null);

  private readonly _setupStorageListener = (() => {
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === 'token') {
        this.token.set(localStorage.getItem('token'));
      }
    });
    return true;
  });

  isAuthenticated = computed(() => {
    const t = this.token(); 
     return !!t && !this.isTokenExpired(t);
  })

  // Login usando base de datos simulada
  login(body: Partial<User>): Observable<User> {
    const email = body.email || '';
    const password = body.password || '';
    
    return this.mockApi.login(email, password).pipe(
      tap((user: User) => {
        const token = user.access_token ?? 'mock_token_' + user.idUser;
        // Guardar con las mismas claves que el AuthService real para compatibilidad
        const storedUser = { ...user, id: user.idUser, role: (user.role || '').toLowerCase() };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(storedUser));
        this.token.set(token);
        console.log('Usuario autenticado en base de datos simulada:', user.name, 'token:', token, 'storedUser:', storedUser);
      })
    );
  }

  // Registro usando base de datos simulada
  register(body: Partial<User>): Observable<User> {
    return this.mockApi.register(body).pipe(
      tap((user: User) => {
        console.log('Usuario registrado en base de datos simulada:', user.name);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token.set(null);
    console.log('Usuario deslogueado de base de datos simulada');
  }

  getToken(): string | null {
    return this.token();
  }

  getUser(): User | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) as User : null;
  }

  // Métodos adicionales para simulación
  getAllUsers(): Observable<User[]> {
    return this.mockApi.getAllUsers();
  }

  getUserById(id: number): Observable<User | undefined> {
    return this.mockApi.getUserById(id);
  }

  updateUser(id: number, userData: Partial<User>): Observable<User | undefined> {
    return this.mockApi.updateUser(id, userData);
  }

  deleteUser(id: number): Observable<boolean> {
    return this.mockApi.deleteUser(id);
  }

  verifyToken(token: string): Observable<{ valid: boolean; user?: User }> {
    // Verificación simple de token simulado
    const isValid = token.startsWith('mock_token_') || token.startsWith('mock_jwt_token_') || token.startsWith('mock_token');
    if (isValid) {
      const match = token.match(/(mock_jwt_token_|mock_token_)(\d+)/);
      if (match) {
        const userId = parseInt(match[2]);
        return this.mockApi.getUserById(userId).pipe(
          map(user => ({
            valid: true,
            user: user || undefined
          }))
        );
      }
    }
    return of({ valid: false });
  }

  // Helper methods
  private isTokenExpired(token: string): boolean {
    try {
      // Para tokens simulados, nunca expiran
      if (token.startsWith('mock_token_')) {
        return false;
      }
      
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (!payload.exp) return false;
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  // Simular refresh token
  refreshToken(oldToken: string): Observable<{ token: string; user: User }> {
    const match = oldToken.match(/mock_token_(\d+)/);
    if (match) {
      const userId = parseInt(match[1]);
      return this.mockApi.getUserById(userId).pipe(
        map(user => {
          if (!user) {
            throw new Error('Usuario no encontrado');
          }
          const newToken = `mock_token_${userId}_${Date.now()}`;
          localStorage.setItem('token', newToken);
          this.token.set(newToken);
          return {
            token: newToken,
            user: user
          };
        })
      );
    }
    
    return throwError(() => new Error('Token inválido'));
  }

  // Simular cambio de contraseña
  changePassword(userId: number, oldPassword: string, newPassword: string): Observable<boolean> {
    const user = this.getUser();
    if (user && user.idUser === userId) {
      // En simulación, aceptamos cualquier contraseña vieja
      return this.mockApi.getUserById(userId).pipe(
        map(existingUser => {
          if (existingUser) {
            // Actualizar en base de datos simulada
            this.mockApi.updateUser(userId, { password: newPassword }).subscribe();
            return true;
          }
          return false;
        })
      );
    }
    return of(false);
  }
}