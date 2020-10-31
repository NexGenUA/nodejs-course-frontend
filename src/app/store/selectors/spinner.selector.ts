import { nodes, SpinnerState, State } from '../state.model';
import { createFeatureSelector, createSelector, Selector } from '@ngrx/store';

export const getSpinnerFeature: Selector<State, SpinnerState> =
  createFeatureSelector<SpinnerState>(nodes.spinner);

export const getSpinner: Selector<State, boolean> = createSelector(
  getSpinnerFeature,
  (state: SpinnerState): boolean => state.isLoad
);
