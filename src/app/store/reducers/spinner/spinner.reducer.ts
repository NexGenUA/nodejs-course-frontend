import { ActionReducer } from '@ngrx/store';
import { spinnerActionType, SpinnerState } from '../../state.model';
import { SpinnerActions } from '../../actions/spinner.action';

const initialState: SpinnerState = {
  isLoad: false,
};

export const spinnerReducer: ActionReducer<SpinnerState> = (
  state: SpinnerState = initialState,
  action: SpinnerActions,
): SpinnerState => {
  switch (action.type) {
    case spinnerActionType.spinnerOn:
      return {
        ...state,
        isLoad: true,
      };
    case spinnerActionType.spinnerOff:
      return {
        ...state,
        isLoad: false,
      };
    default:
      return state;
  }
};
