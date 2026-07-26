import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    // Intentar obtener token directamente si la señal no refleja el cambio inmediato
    let tokenFromService: any = null;
    try {
      tokenFromService = (typeof (this.auth as any).getToken === 'function') ? (this.auth as any).getToken() : null;
    } catch (e) {
      tokenFromService = null;
    }

    const tokenFromStorage = localStorage.getItem('token');
    let logged = false;

    if (typeof this.auth.isAuthenticated === 'function') {
      try {
        logged = !!(this.auth as any).isAuthenticated();
      } catch {
        logged = false;
      }
    }

    // Si la señal dijo false pero hay token en localStorage (mock), confiar en token
    if (!logged && tokenFromStorage) {
      // considerar tokens mock como válidos
      if (tokenFromStorage.startsWith('mock')) logged = true;
      else logged = true; // fallback: hay token, marcar como autenticado
    }

    console.log('[AuthGuard] tokenFromService:', tokenFromService, 'tokenFromStorage:', tokenFromStorage, 'logged:', logged, 'route.data:', route.data);

    if (!logged) {
      this.messageService.add({severity:'warn', summary: 'Acceso denegado', detail: 'Debes iniciar sesión para acceder a esta página.'});
      // redirige al login y guarda la url de retorno
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    // Si la ruta exige roles, verificar que el usuario lo posea
    // Buscar roles en la ruta actual y en padres
    let requiredRoles: string[] = [];
    if (route.data && route.data['roles']) requiredRoles = requiredRoles.concat(route.data['roles']);
    let parent = route.parent;
    while (parent) {
      if (parent.data && parent.data['roles']) requiredRoles = requiredRoles.concat(parent.data['roles']);
      parent = parent.parent;
    }
    console.log('[AuthGuard] requiredRoles merged:', requiredRoles);
    if (requiredRoles && requiredRoles.length > 0) {
      const user = this.auth.getUser();
      const userRole = user && ((user as any).role || (user as any).role) ? String((user as any).role).toLowerCase() : '';
      console.log('[AuthGuard] userRole:', userRole, 'user:', user);
      const allowed = requiredRoles.map(r => r.toString().toLowerCase()).includes(userRole);
      if (!allowed) {
        this.messageService.add({severity:'error', summary: 'Permisos insuficientes', detail: 'No tienes permisos para acceder a esta sección.'});
        return this.router.createUrlTree(['/home']);
      }
    }

    return true;
  }
}