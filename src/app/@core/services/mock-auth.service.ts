import { Injectable, inject } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { MockDatabaseService } from './mock-database.service';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private mockDb = inject(MockDatabaseService);

  /**
   * Autenticación de usuario
   */
  login(email: string, password: string): Observable<User> {
    const user = this.mockDb.authenticate(email, password);
    
    if (user) {
      return of(user).pipe(
        delay(300),
        map(user => ({
          ...user,
          access_token: `mock_jwt_token_${user.idUser}_${Date.now()}`
        }))
      );
    }
    
    return throwError(() => new Error('Credenciales inválidas')).pipe(delay(300));
  }

  /**
   * Registro de nuevo usuario
   */
  register(userData: Partial<User>): Observable<User> {
    // Verificar si el usuario ya existe
    const existingUser = this.mockDb.getUserByEmail(userData.email || '');
    if (existingUser) {
      return throwError(() => new Error('El usuario ya existe')).pipe(delay(300));
    }

    const newUser = this.mockDb.createUser(userData);
    return of(newUser).pipe(
      delay(400),
      map(user => ({
        ...user,
        access_token: `mock_jwt_token_${user.idUser}_${Date.now()}`
      }))
    );
  }

  /**
   * Obtener todos los usuarios (admin only)
   */
  getAllUsers(): Observable<User[]> {
    const users = this.mockDb.getAllUsers();
    return of(users).pipe(
      delay(350),
      map(users => users.map(user => ({
        ...user,
        // Ocultar contraseñas en la respuesta
        password: '********'
      })))
    );
  }

  /**
   * Obtener usuario por ID
   */
  getUserById(id: number): Observable<User | undefined> {
    const user = this.mockDb.getUserById(id);
    return of(user).pipe(
      delay(200),
      map(user => user ? {
        ...user,
        password: '********'
      } : undefined)
    );
  }

  /**
   * Actualizar usuario
   */
  updateUser(id: number, userData: Partial<User>): Observable<User | undefined> {
    const updatedUser = this.mockDb.updateUser(id, userData);
    return of(updatedUser).pipe(
      delay(350),
      map(user => user ? {
        ...user,
        password: '********'
      } : undefined)
    );
  }

  /**
   * Eliminar usuario
   */
  deleteUser(id: number): Observable<boolean> {
    const result = this.mockDb.deleteUser(id);
    return of(result).pipe(delay(300));
  }

  /**
   * Verificar token (simulación)
   */
  verifyToken(token: string): Observable<{ valid: boolean; user?: User }> {
    // En una implementación real, esto verificaría un JWT
    const isValid = token.startsWith('mock_jwt_token_');
    
    if (isValid) {
      // Extraer ID del token simulado
      const match = token.match(/mock_jwt_token_(\d+)_/);
      if (match) {
        const userId = parseInt(match[1]);
        const user = this.mockDb.getUserById(userId);
        return of({
          valid: true,
          user: user ? { ...user, password: '********' } : undefined
        }).pipe(delay(200));
      }
    }
    
    return of({ valid: false }).pipe(delay(200));
  }

  /**
   * Refrescar token (simulación)
   */
  refreshToken(oldToken: string): Observable<{ token: string; user: User }> {
    const match = oldToken.match(/mock_jwt_token_(\d+)_/);
    if (match) {
      const userId = parseInt(match[1]);
      const user = this.mockDb.getUserById(userId);
      
      if (user) {
        const newToken = `mock_jwt_token_${userId}_${Date.now()}`;
        return of({
          token: newToken,
          user: { ...user, password: '********' }
        }).pipe(delay(300));
      }
    }
    
    return throwError(() => new Error('Token inválido')).pipe(delay(300));
  }

  /**
   * Obtener estadísticas del usuario
   */
  getUserStatistics(userId: number): Observable<any> {
    const stats = this.mockDb.getUserStatistics(userId);
    return of(stats).pipe(delay(250));
  }

  /**
   * Cambiar contraseña
   */
  changePassword(userId: number, oldPassword: string, newPassword: string): Observable<boolean> {
    const user = this.mockDb.getUserById(userId);
    
    if (!user) {
      return throwError(() => new Error('Usuario no encontrado')).pipe(delay(300));
    }
    
    if (user.password !== oldPassword) {
      return throwError(() => new Error('Contraseña actual incorrecta')).pipe(delay(300));
    }
    
    const updated = this.mockDb.updateUser(userId, { password: newPassword });
    return of(!!updated).pipe(delay(350));
  }

  /**
   * Restablecer contraseña (simulación)
   */
  resetPassword(email: string): Observable<boolean> {
    const user = this.mockDb.getUserByEmail(email);
    
    if (!user) {
      // Por seguridad, no revelamos si el usuario existe o no
      return of(true).pipe(delay(400));
    }
    
    // En una implementación real, aquí se enviaría un correo
    return of(true).pipe(delay(400));
  }
}

// No helper functions required; use rxjs/operators.map