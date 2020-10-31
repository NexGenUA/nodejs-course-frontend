import { ActionReducer } from '@ngrx/store';
import { userActionType, UserState } from '../../state.model';
import { UserActions, UserSaveAction, UserSetTokenAction } from '../../actions/user.action';

const token = localStorage.getItem('token');

const initialState: UserState = {
  user: null,
  error: '',
  token,
};

export const userReducer: ActionReducer<UserState> = (
  state: UserState = initialState,
  action: UserActions,
): UserState => {
  switch (action.type) {
    case userActionType.saveUser:
      return {
        ...state,
        user: (action as UserSaveAction).payload,
      };
    case userActionType.setToken:
      const autToken = (action as UserSetTokenAction).payload.token;
      localStorage.setItem('token', autToken);
      return {
        ...state,
        token: autToken,
      };
    case userActionType.clearUser:
      return {
        ...state,
        user: null,
        token: null
      };
    default:
      return state;
  }
};
