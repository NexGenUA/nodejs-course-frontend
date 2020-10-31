import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { getToken, getUser } from '../../store/selectors/user.selector';
import { select, Store } from '@ngrx/store';
import { AskDialogComponent } from '../../shared/components/ask-dialog/ask-dialog.component';
import { paths } from '../../shared/constants/constants';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { EditUserDialogComponent } from '../../shared/components/edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuth: boolean = environment.auth;
  user$: Observable<User> = this.store$.pipe(select(getUser));
  subscribers: Subscription[] = [];
  token$: Observable<string> = this.store$.pipe(select(getToken));

  constructor(
    private store$: Store,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  deleteUser(): void {
    const dialogRef = this.dialog.open(AskDialogComponent, {
      data: 'User',
      width: '200px'
    });

    const dialogSub = dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.user$.pipe(take(1)).subscribe(user => {
          const subscriber = this.authService.deleteUser(user.id).subscribe(() => {
            this.router.navigate([paths.LOGIN]);
          }, () => {
          });
          this.subscribers.push(subscriber);
        });

      }
    });
    this.subscribers.push(dialogSub);
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(subscriber => {
      subscriber.unsubscribe();
    });
  }

  editUser(): void {
    this.dialog.open(EditUserDialogComponent);
  }

  logout(): void {
    this.router.navigate([paths.LOGIN]);
  }
}
