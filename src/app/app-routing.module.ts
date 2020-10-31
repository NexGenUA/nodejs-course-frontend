import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './components/board/board.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { paths } from './shared/constants/constants';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';


const routes: Routes = [
  {
    path: paths.BOARD,
    component: BoardComponent,
    canActivate: [AuthGuard],
    data: {title: 'Board'}
  },
  {
    path: `${paths.BOARD}/:${paths.BOARD_ID}`,
    component: BoardComponent,
    canActivate: [AuthGuard],
    data: {title: 'Board'}
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {title: 'Login'}
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    data: {title: 'Registration'}
  },
  { path: '',   redirectTo: paths.BOARD, pathMatch: 'full' },
  {
    path: '**',
    component: NotFoundComponent,
    canActivate: [AuthGuard],
    data: {title: 'Page Not Found'}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
