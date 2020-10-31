import { Action } from '@ngrx/store';
import { columnActionType, ColumnState } from '../state.model';

export class GetColumnByIdAction implements Action {
  readonly type: string = columnActionType.getColumnsById;
}

export class LoadColumnAction implements Action {
  readonly type: string = columnActionType.getColumns;
  constructor(public payload: ColumnState) { }
}

export type ColumnActions = GetColumnByIdAction | LoadColumnAction;
