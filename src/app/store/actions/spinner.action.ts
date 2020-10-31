import { Action } from '@ngrx/store';
import { spinnerActionType } from '../state.model';

export class SpinnerOnAction implements Action {
  readonly type: string = spinnerActionType.spinnerOn;
}

export class SpinnerOffAction implements Action {
  readonly type: string = spinnerActionType.spinnerOff;
}

export type SpinnerActions = SpinnerOnAction | SpinnerOffAction;
