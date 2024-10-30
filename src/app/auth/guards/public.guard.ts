import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { map, Observable, pipe, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

const checkAuthStatus = (): boolean | Observable<boolean> => {
 const authService: AuthService = inject(AuthService);
 const router: Router = inject(Router);

 return authService.checkAuthentication()
  .pipe(
    tap(isAuthenticated => {
      if(isAuthenticated) router.navigateByUrl('/');
    }),
    map(isAuthenticated => !isAuthenticated)
  );
}

export const canActivatePublicGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) =>  checkAuthStatus();

export const canMatchPublicGuard: CanMatchFn = (
  state: Route,
  segmets: UrlSegment[]
) => checkAuthStatus();
