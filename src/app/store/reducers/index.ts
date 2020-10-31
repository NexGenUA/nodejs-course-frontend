import { nodes, State } from '../state.model';
import { boardReducer } from './board/board.reducer';
import { userReducer } from './user/user.reducer';
import { columnReducer } from './column/column.reducer';
import { taskReducer } from './task/task.reducer';
import { spinnerReducer } from './spinner/spinner.reducer';
import { ActionReducerMap } from '@ngrx/store';
import { DEFAULT_ROUTER_FEATURENAME, routerReducer } from '@ngrx/router-store';

export const reducers: ActionReducerMap<State> = {
  [nodes.board]: boardReducer,
  [nodes.user]: userReducer,
  [nodes.column]: columnReducer,
  [nodes.task]: taskReducer,
  [DEFAULT_ROUTER_FEATURENAME]: routerReducer,
  [nodes.spinner]: spinnerReducer,
};
