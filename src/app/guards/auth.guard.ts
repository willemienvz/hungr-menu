import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const targetUrl = state.url;

    // Check localStorage instead of waiting for Firebase auth state
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      return of(true); // Allow access if logged in
    } else {
      this.authService.setRedirectUrl(targetUrl); // Save the target URL
      this.router.navigate([`/${route.paramMap.get('id')}/login`]); // Redirect to login page
      return of(false);
    }
  }
}
