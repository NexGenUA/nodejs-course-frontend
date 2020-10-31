import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserClearAction, UserSetTokenAction } from '../../store/actions/user.action';
import { Router } from '@angular/router';
import { paths } from '../../shared/constants/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  auth: FormGroup;
  hide = true;
  subscribers: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private store$: Store,
    private router: Router,
  ) {
    this.auth = new FormGroup({
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

  login() {
    if (this.auth.valid) {
      const authSub = this.authService.login(this.auth.value).subscribe(response => {
        this.store$.dispatch(new UserSetTokenAction(response));
        this.router.navigate([paths.BOARD]);
      }, () => {
      });
      this.subscribers.push(authSub);
    }
  }

  ngOnInit(): void {
    this.store$.dispatch(new UserClearAction());
    localStorage.removeItem('token');
  }
}
