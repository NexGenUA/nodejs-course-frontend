import { UserState, nodes, State } from '../state.model';
import { createFeatureSelector, createSelector, Selector } from '@ngrx/store';
import { User } from '../../shared/models/user.model';

export const getUserFeature: Selector<State, UserState> =
  createFeatureSelector<UserState>(nodes.user);

export const getToken: Selector<State, string> = createSelector(
  getUserFeature,
  (state: UserState): string => state.token
);

export const getUser: Selector<State, User> = createSelector(
  getUserFeature,
  (state: UserState): User => state.user
);
