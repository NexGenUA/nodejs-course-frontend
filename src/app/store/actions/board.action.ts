import { Action } from '@ngrx/store';
import { boardActionType, BoardState } from '../state.model';
import { Board } from '../../shared/models/board.model';

export class GetBoardsAction implements Action {
  readonly type: string = boardActionType.getBoards;
}

export class LoadBoardsAction implements Action {
  readonly type: string = boardActionType.loadBoards;
  constructor(public payload: BoardState) { }
}

export class UpdateBoardAction implements Action {
  readonly type: string = boardActionType.updateBoard;
  constructor(public payload: Board) { }
}

export class CreateBoardAction implements Action {
  readonly type: string = boardActionType.createBoard;
  constructor(public payload: Board) { }
}

export class ResetBoardAction implements Action {
  readonly type: string = boardActionType.resetBoard;
}

export type BoardActions =
  LoadBoardsAction | GetBoardsAction | UpdateBoardAction | CreateBoardAction | ResetBoardAction;
