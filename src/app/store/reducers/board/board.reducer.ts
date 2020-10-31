import { ActionReducer } from '@ngrx/store';
import { boardActionType, BoardState } from '../../state.model';
import { BoardActions, CreateBoardAction, LoadBoardsAction, UpdateBoardAction } from '../../actions/board.action';

const initialState: BoardState = {
  items: [],
};

export const boardReducer: ActionReducer<BoardState> = (
  state: BoardState = initialState,
  action: BoardActions,
): BoardState => {
  switch (action.type) {
    case boardActionType.loadBoards:
      return {
        ...state,
        items: (action as LoadBoardsAction).payload.items,
      };
    case boardActionType.updateBoard:
      return {
        ...state,
        items: state.items.map(board => {
          const updatedBoard = (action as UpdateBoardAction).payload;
          if (board.id === updatedBoard.id) {
            return {...board, ...updatedBoard};
          }
          return board;
        })
      };
    case boardActionType.createBoard:
      return {
        ...state,
        items: [...state.items, (action as CreateBoardAction).payload]
      };
    case boardActionType.resetBoard:
      return {
        ...state,
        items: []
      };
    default:
      return state;
  }
};
