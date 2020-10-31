import { Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Column } from '../../shared/models/column.model';
import { select, Store } from '@ngrx/store';
import { getBoards, getBoardTitle } from '../../store/selectors/board.selector';
import { Observable, Subscription } from 'rxjs';
import { Board } from '../../shared/models/board.model';
import { GetBoardsAction, ResetBoardAction, UpdateBoardAction } from '../../store/actions/board.action';
import { Router } from '@angular/router';
import { paths } from '../../shared/constants/constants';
import { GetColumnByIdAction } from '../../store/actions/column.action';
import { selectBoardId, selectRouter } from '../../store/selectors/router.selector';
import { getColumns } from '../../store/selectors/column.selector';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Task } from 'src/app/shared/models/task.model';
import { HttpService } from '../../shared/services/http.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { AddBoardDialogComponent } from '../../shared/components/add-board-dialog/add-board-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AskDialogComponent } from '../../shared/components/ask-dialog/ask-dialog.component';
import { log } from 'util';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  @ViewChild('columnTitle') columnTitle: ElementRef;
  @ViewChild('addColumnContainer') addColumnContainer: ElementRef;

  columns$: Observable<Column[]> = this.store$.pipe(select(getColumns));
  columns: Column[] = [];
  board$: Observable<Board[]> = this.store$.pipe(select(getBoards));
  boardId$: Observable<string> = this.store$.pipe(select(selectBoardId));
  isTaskAdd = false;
  boardTitle$: Observable<string> = this.store$.pipe(select(getBoardTitle));
  selectedBoard = '';
  isEditColumn = false;
  currentBoard: Board = null;
  isAddColumn = false;
  createFormColumn: FormGroup;
  canShow = false;

  private boardsCount = -1;
  private boardIdSubscriber: Subscription = null;
  private subscribers: Subscription[] = [];
  private listener = () => { };

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private store$: Store,
    private router: Router,
    private httpService: HttpService,
    public dialog: MatDialog,
  ) {
    this.store$.dispatch(new GetBoardsAction());
    const columnsSubscriber = this.columns$.subscribe(columns => {
      this.columns = JSON.parse(JSON.stringify(columns));
    });

    this.subscribers.push(columnsSubscriber);
    this.createFormColumn = new FormGroup({
      titleColumn: new FormControl('', [
        Validators.minLength(1),
        Validators.required
      ])
    });

    const getBoardSubscriber = this.httpService.getBoard().subscribe(board => {
      if (board) {
        this.currentBoard = JSON.parse(JSON.stringify(board));
      }
      this.canShow = true;
    }, () => this.canShow = true);
    this.subscribers.push(getBoardSubscriber);

    const subscriber = this.board$.subscribe(boards => {
      if (boards.length) {
        if (this.boardIdSubscriber) {
          this.boardIdSubscriber.unsubscribe();
          this.boardIdSubscriber = null;
        }
        this.boardIdSubscriber = this.boardId$.subscribe(id => {
          if (id) {
            boards.forEach(board => {
              if (board.id === id) {
                this.currentBoard = JSON.parse(JSON.stringify(board));
                this.selectedBoard = id;
                if (((boards.length === this.boardsCount) || this.boardsCount === -1) && board.columns?.length) {
                  this.store$.dispatch(new GetColumnByIdAction());
                } else {
                  this.columns = board.columns;
                }
                this.boardsCount = boards.length;
              }
            });
          }
        });
        this.subscribers.push(this.boardIdSubscriber);
      }
    });
    this.subscribers.push(subscriber);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscribers.forEach(subscriber => {
      subscriber.unsubscribe();
    });
    this.store$.dispatch(new ResetBoardAction());
    this.listener();
  }

  selectBoard(value) {
    this.router.navigate([paths.BOARD, value]).then(() => {
      this.canShow = true;
    });
  }

  drop(event: CdkDragDrop<any[], any>) {
    const {container, previousContainer, currentIndex, previousIndex} = event;

    if (currentIndex !== previousIndex) {
      const board: Board = JSON.parse(JSON.stringify(this.currentBoard));

      delete board.title;

      moveItemInArray(container.data, previousIndex, currentIndex);

      const columns: Column[] = JSON.parse(JSON.stringify(container.data));

      board.columns = columns.map((column, i) => {
        delete column.tasks;
        column.order = i;
        return column;
      });

      const boardSubscriber = this.httpService.updateBoard(board).subscribe({
        error: () => {
          moveItemInArray(previousContainer.data, currentIndex, previousIndex);
        }
      });

      this.subscribers.push(boardSubscriber);
    }
  }

  newTask(task: Task) {
    const column = this.columns.find(c => c.id === task.columnId);
    column.tasks.push(task);
  }

  taskAdd(value) {
    this.isTaskAdd = value;
  }

  editColumn(value: boolean) {
    this.isEditColumn = value;
  }

  addColumn() {
    if (!this.isAddColumn) {
      this.listener = this.renderer.listen(this.document, 'mousedown', ({target}) => {
        if (!this.addColumnContainer?.nativeElement.contains(target)) {
          this.disableAddColumn(!target.classList.contains('close'));
        }
      });
      this.isAddColumn = true;
    }
    setTimeout(() => {
      this.columnTitle?.nativeElement?.focus();
    }, 0);
  }

  createColumn() {
    if (this.createFormColumn.valid) {
      const columns: Column[] = JSON.parse(JSON.stringify(this.columns));

      delete this.currentBoard.title;

      this.currentBoard.columns = columns.map((c, i) => {
        delete c.tasks;
        c.order = i;
        return c;
      });

      const column: Column = {
        title: this.createFormColumn.get('titleColumn').value,
        order: columns.length
      };

      delete this.currentBoard.title;
      this.currentBoard.columns.push(column);

      const subscriber = this.httpService.updateBoard(this.currentBoard).subscribe((board) => {
        this.store$.dispatch(new UpdateBoardAction(board));
        this.createFormColumn.reset();
        this.disableAddColumn();
      });
      this.subscribers.push(subscriber);
    }

  }

  cancel(e) {
    e.stopPropagation();
    this.disableAddColumn(false);
  }

  disableAddColumn(isCanCreate = true): void {
    if (this.createFormColumn.valid && isCanCreate) {
      this.createColumn();
    } else {
      this.isAddColumn = false;
      this.listener();
      this.createFormColumn.reset();
    }
  }

  createBoard(): void {
    this.dialog.open(AddBoardDialogComponent, {
      data: 'Column',
      width: '250px'
    });
  }

  deleteBoard(): void {
    if (this.currentBoard) {
      const dialogRef = this.dialog.open(AskDialogComponent, {
        data: 'Board',
        width: '200px'
      });

      const dialogSub = dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          const subscriber = this.httpService.deleteBoard(this.currentBoard.id).subscribe(() => {
            this.router.navigate([paths.BOARD]);
          }, () => {
          });
          this.subscribers.push(subscriber);
        }
      });
      this.subscribers.push(dialogSub);
    }
  }
}
