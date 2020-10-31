import { createFeatureSelector, createSelector, Selector } from '@ngrx/store';
import { BoardState, nodes, State } from '../state.model';
import { Board } from '../../shared/models/board.model';
import { selectBoardId } from './router.selector';

const getBoardsFeature: Selector<State, BoardState> =
  createFeatureSelector<BoardState>(nodes.board);

export const getBoards: Selector<State, Board[]> = createSelector(
  getBoardsFeature,
  (state: BoardState): Board[] => {
    return state.items;
  },
);

export const getBoardById: Selector<State, Board> = createSelector(
  getBoardsFeature,
  selectBoardId,
  (state: BoardState, id: string): Board => {
    return state.items.find(board => board.id === id);
  },
);

export const getBoardTitle: Selector<State, string> = createSelector(
  getBoardsFeature,
  selectBoardId,
  (state: BoardState, id: string): string => {
    if (state.items.length) {
      return state.items.find(board => board.id === id)?.title || '';
    }
    return ' ';
  },
);
