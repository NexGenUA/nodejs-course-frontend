import { getSelectors } from '@ngrx/router-store';
import { paths } from '../../shared/constants/constants';
import { State } from '../state.model';

export const selectRouter = (state: State) => state.router;

export const { selectUrl, selectRouteParam } = getSelectors(selectRouter);

export const selectBoardId = selectRouteParam(paths.BOARD_ID);
