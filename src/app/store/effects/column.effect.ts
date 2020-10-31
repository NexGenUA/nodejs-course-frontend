import { Injectable, OnDestroy } from '@angular/core';
import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { columnActionType } from '../state.model';
import { map, switchMap } from 'rxjs/operators';
import { HttpService } from '../../shared/services/http.service';
import { LoadColumnAction } from '../actions/column.action';
import { Observable, Subscription } from 'rxjs';
import { Board } from '../../shared/models/board.model';
import { select, Store } from '@ngrx/store';
import { getBoardById } from '../selectors/board.selector';
import { Column } from '../../shared/models/column.model';

interface ColumnIds {
  [key: string]: number;
}

@Injectable()
export class ColumnEffect implements OnDestroy {
  private boardById$: Observable<Board> = this.store$.pipe(select(getBoardById));
  private board: Board = null;
  private readonly subscriber: Subscription;

  public loadTasksById$: CreateEffectMetadata = createEffect(() => this.actions$.pipe(
    ofType(columnActionType.getColumnsById),
    switchMap(() => {
      if (this.board) {
        return this.httpService.getTasksByBoardId(this.board.id).pipe(
          map(tasks => {
            let columns: Column[] = [];
            if (this.board) {
              columns = JSON.parse(JSON.stringify(this.board.columns));
              columns.forEach(column => column.tasks = column.tasks || []);
              const columnsIds: ColumnIds = columns.reduce((acc, column, idx) => {
                acc[column.id] = idx;
                return acc;
              }, {});
              const compare = (a, b) => a.order - b.order;
              const getIdx = (id: string): number => columnsIds[id] || 0;
              tasks.forEach(task => columns[getIdx(task.columnId)]?.tasks.push(task));
              columns.sort(compare);
              columns.forEach(column => column.tasks.sort(compare));
            }
            return new LoadColumnAction({
              items: columns
            });
          })
        );
      }
      return [];
    })
  ));

  constructor(
    private actions$: Actions,
    private httpService: HttpService,
    private store$: Store,
  ) {
    this.subscriber = this.boardById$.subscribe(board => {
      this.board = board;
    });
  }

  ngOnDestroy(): void {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }
}
