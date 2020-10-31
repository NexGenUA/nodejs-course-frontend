import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ColumnComponent } from './components/column/column.component';
import { BoardComponent } from './components/board/board.component';
import { TaskComponent } from './components/task/task.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FooterComponent } from './components/footer/footer.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { environment } from '../environments/environment';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { reducers } from './store/reducers';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { BoardEffect } from './store/effects/board.effect';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ColumnEffect } from './store/effects/column.effect';
import { DeepCopyPipe } from './shared/pipes/deep-copy.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { AskDialogComponent } from './shared/components/ask-dialog/ask-dialog.component';
import { CatchErrorInterceptor } from './shared/interceptors/catch-error.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AddBoardDialogComponent } from './shared/components/add-board-dialog/add-board-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SpinnerInterceptor } from './shared/interceptors/spinner.interceptor';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { MatIconModule } from '@angular/material/icon';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { MatMenuModule } from '@angular/material/menu';
import { EditUserDialogComponent } from './shared/components/edit-user-dialog/edit-user-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ColumnComponent,
    BoardComponent,
    TaskComponent,
    FooterComponent,
    NotFoundComponent,
    DeepCopyPipe,
    AskDialogComponent,
    AddBoardDialogComponent,
    LoginComponent,
    RegistrationComponent,
    EditUserDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    DragDropModule,
    HttpClientModule,
    MatSnackBarModule,
    MatIconModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: req => req as any,
      }
    }),
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    EffectsModule.forRoot([BoardEffect, ColumnEffect]),
    StoreRouterConnectingModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressBarModule,
    MatMenuModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthInterceptor
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: SpinnerInterceptor
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: CatchErrorInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
