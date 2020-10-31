import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { select, Store } from '@ngrx/store';
import { User } from '../../models/user.model';
import { getUser } from '../../../store/selectors/user.selector';
import { take } from 'rxjs/operators';
import { UserSaveAction } from '../../../store/actions/user.action';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnDestroy {
  form: FormGroup;
  subscribers: Subscription[] = [];
  user$: Observable<User> = this.store$.pipe(select(getUser));
  id: string;

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    private authService: AuthService,
    private store$: Store,
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.minLength(1),
        Validators.required
      ]),
      login: new FormControl('', [
        Validators.minLength(1),
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.minLength(1),
        Validators.required
      ])
    });
    this.user$.pipe(take(1)).subscribe(user => {
      this.id = user.id;
      this.form.setValue({
        name: user.name,
        login: user.login,
        password: ''
      });
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editUser() {
    if (this.form.valid) {
      this.authService.editUser(this.id, this.form.value).pipe(take(1)).subscribe(user => {
        this.store$.dispatch(new UserSaveAction(user));
        this.dialogRef.close();
      }, () => {});
    }
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(subscriber => {
      subscriber.unsubscribe();
    });
  }
}
