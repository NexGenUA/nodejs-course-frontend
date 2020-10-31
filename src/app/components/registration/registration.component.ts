import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { paths } from '../../shared/constants/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserClearAction } from '../../store/actions/user.action';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnDestroy, OnInit {
  sign: FormGroup;
  hide = true;
  subscribers: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private store$: Store,
  ) {
    this.sign = new FormGroup({
      name: new FormControl('', [
        Validators.minLength(1),
        Validators.required,
      ]),
      login: new FormControl('', [
        Validators.minLength(1),
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.minLength(1),
        Validators.required,
      ]),
    });
  }

  registration() {
    if (this.sign.valid) {
      const signSub = this.authService.create(this.sign.value).subscribe(() => {
        this.router.navigate([paths.LOGIN]).then(() => {
          this.snackBar.open('Now you can login', 'SUCCESS', {
            duration: 5000,
          });
        });
      }, () => {
      });
      this.subscribers.push(signSub);
    }
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(subscriber => {
      subscriber.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.store$.dispatch(new UserClearAction());
    localStorage.removeItem('token');
  }
}
