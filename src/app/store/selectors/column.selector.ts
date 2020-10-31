import { createFeatureSelector, createSelector, Selector } from '@ngrx/store';
import { ColumnState, nodes, State } from '../state.model';
import { Column } from '../../shared/models/column.model';

export const getColumnFeature: Selector<State, ColumnState> =
  createFeatureSelector<ColumnState>(nodes.column);

export const getColumns: Selector<State, Column[]> = createSelector(
  getColumnFeature,
  (state: ColumnState): Column[] => state.items
);

