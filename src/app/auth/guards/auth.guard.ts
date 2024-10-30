import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, pipe, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

const checkAuthStatus = (): boolean | Observable<boolean> => {
 const authService: AuthService = inject(AuthService);
 const router: Router = inject(Router);

 return authService.checkAuthentication()
  .pipe(
    tap(isAuthenticated => {
      if(!isAuthenticated) router.navigateByUrl('/auth');
    })
  )
}

export const canActivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => checkAuthStatus();

export const canMatchGuard: CanMatchFn = (
  state: Route,
  segmets: UrlSegment[]
) => checkAuthStatus();
