import { ActionReducer } from '@ngrx/store';
import { columnActionType, ColumnState } from '../../state.model';
import { ColumnActions, LoadColumnAction } from '../../actions/column.action';

const initialState: ColumnState = {
  items: [],
};

export const columnReducer: ActionReducer<ColumnState> = (
  state: ColumnState = initialState,
  action: ColumnActions,
): ColumnState => {
  switch (action.type) {
    case columnActionType.getColumns:
      return {
        ...state,
        items: (action as LoadColumnAction).payload.items,
      };
    default:
      return state;
  }
};
