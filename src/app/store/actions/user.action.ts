import { Action } from '@ngrx/store';
import { userActionType } from '../state.model';
import { Token, User } from '../../shared/models/user.model';

export class UserSaveAction implements Action {
  readonly type: string = userActionType.saveUser;
  constructor(public payload: User) { }
}

export class UserSetTokenAction implements Action {
  readonly type: string = userActionType.setToken;
  constructor(public payload: Token) { }
}

export class UserClearAction implements Action {
  readonly type: string = userActionType.clearUser;
}

export type UserActions = UserSaveAction | UserSetTokenAction | UserClearAction;
