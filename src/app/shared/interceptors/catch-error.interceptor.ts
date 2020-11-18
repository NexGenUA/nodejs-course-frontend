import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { status, paths } from '../constants/constants';
import { Router } from '@angular/router';

@Injectable()
export class CatchErrorInterceptor implements HttpInterceptor {
  private readonly config = {
    duration: 5000,
  };

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(
        (err: HttpErrorResponse) => this.handleError(err)
      )
    );
  }

  private handleError(err: HttpErrorResponse) {
    let {error} = err;
    error = typeof error === 'string' ? error : 'Connection error';
    switch (err.status) {
      case status.UNAUTHORIZED: {
        this.errMessage('Token is invalid', `status: ${err.status}`);
        break;
      }
      case status.FORBIDDEN: {
        this.errMessage('Access denied', `status: ${err.status}`);
        break;
      }
      default: {
        this.snackBar.open(error, `status: ${err.status}`, this.config);
      }
    }

    console.log(err.status);

    return throwError(err);
  }

  errMessage(message, statusCode) {
    this.snackBar.open(message, statusCode, this.config);
    this.router.navigate([paths.LOGIN]);
  }
}
