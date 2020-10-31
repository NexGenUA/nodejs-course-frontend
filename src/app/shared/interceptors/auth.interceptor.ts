import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { select, Store } from '@ngrx/store';
import { getToken } from '../../store/selectors/user.selector';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token: string;
  token$: Observable<string> = this.store$.pipe(select(getToken));
  subscribers: Subscription[] = [];

  constructor(
    private store$: Store,
  ) {
    const token$Sub = this.token$.subscribe(token => {
      this.token = token;
    });
    this.subscribers.push(token$Sub);
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (environment.auth && request instanceof HttpRequest) {
      if (this.token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.token}`,
          },
        });
      }
    }
    return next.handle(request);
  }
}
