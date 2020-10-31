import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse, HttpSentEvent, HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError, map } from 'rxjs/operators';
import { SpinnerOffAction, SpinnerOnAction } from '../../store/actions/spinner.action';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(private store$: Store) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.store$.dispatch(new SpinnerOnAction());
    return next.handle(request).pipe(
      catchError(
        (err: HttpErrorResponse) => this.handleError(err)
      )
    ).pipe(
      map((event: HttpSentEvent) => {
        if (event instanceof HttpResponse) {
          this.store$.dispatch(new SpinnerOffAction());
        }
        return event;
      })
    );
  }

  private handleError(err: HttpErrorResponse) {
    this.store$.dispatch(new SpinnerOffAction());
    return throwError(err);
  }
}
