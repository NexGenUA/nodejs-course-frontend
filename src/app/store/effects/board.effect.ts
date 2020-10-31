import { Injectable } from '@angular/core';
import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { boardActionType } from '../state.model';
import { map, switchMap } from 'rxjs/operators';
import { HttpService } from '../../shared/services/http.service';
import { BoardActions, LoadBoardsAction } from '../actions/board.action';

@Injectable()
export class BoardEffect {
  public loadBoards$: CreateEffectMetadata = createEffect(() => this.actions$.pipe(
    ofType(boardActionType.getBoards),
    switchMap((action: BoardActions) => {
      return this.httpService.loadBoards().pipe(
        map(res =>
          new LoadBoardsAction({
            items: res
          })
        )
      );
    })
  ));

  constructor(
    private actions$: Actions,
    private httpService: HttpService
  ) {
  }
}
