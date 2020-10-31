import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { getToken, getUser } from '../../store/selectors/user.selector';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { paths } from '../constants/constants';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { UserSaveAction } from '../../store/actions/user.action';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, OnDestroy {
  token: string;
  user: User;
  token$: Observable<string> = this.store$.pipe(select(getToken));
  user$: Observable<User> = this.store$.pipe(select(getUser));
  subscribers: Subscription[] = [];

  constructor(
    private store$: Store,
    private jwtService: JwtHelperService,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
  ) {
    const token$Sub = this.token$.subscribe(token => {
      this.token = token;
    });
    const user$Sub = this.user$.subscribe(user => {
      this.user = user;
    });
    this.subscribers.push(user$Sub);
    this.subscribers.push(token$Sub);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | Promise<boolean> {

    if (environment.auth) {

      if (this.token) {
        const isTokenAlive = !this.jwtService.isTokenExpired(this.token);

        if (isTokenAlive) {
          const id = this.jwtService.decodeToken(this.token).id;
          if (!id) {
            return this.accessDenied('The token must contain an "id" field');
          }

          if (this.user) {
            return true;
          }

          return new Promise(resolve => {
            const userSub = this.authService.getUser(id).subscribe(user => {
              this.store$.dispatch(new UserSaveAction(user));
              resolve(true);
            }, () => {
              resolve(false);
              this.accessDenied('Login first');
            });

            this.subscribers.push(userSub);
          });

        } else {
          return this.accessDenied('Token is Expired');
        }
      } else {
        return this.accessDenied('Login first');
      }
    } else {
      return true;
    }
  }

  accessDenied(action: string) {
    this.snackBar.open('ERROR', action, {
      duration: 5000,
    });
    this.router.navigate([paths.LOGIN]);
    return false;
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(subscriber => {
      subscriber.unsubscribe();
    });
  }
}
