import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges, OnDestroy,
  Output,
  Renderer2, SimpleChanges,
  ViewChild
} from '@angular/core';
import { Column } from '../../shared/models/column.model';
import { Task } from '../../shared/models/task.model';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../shared/services/http.service';
import { Board } from '../../shared/models/board.model';
import { MatDialog } from '@angular/material/dialog';
import { AskDialogComponent } from '../../shared/components/ask-dialog/ask-dialog.component';
import { Store } from '@ngrx/store';
import { UpdateBoardAction } from '../../store/actions/board.action';
import { Observable, Subscription, zip } from 'rxjs';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements OnChanges, OnDestroy {
  @Input() column: Column;
  @Input() isTaskAdd: boolean;
  @Input() isEditColumn: boolean;
  @Input() board: Board;
  @ViewChild('addTask') addTaskContainer: ElementRef;
  @ViewChild('columnTitle') columnTitle: ElementRef;
  @Output() newTask: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() taskAdd: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() editColumn: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isShowAddTaskDialog = false;
  public form: FormGroup;
  public columnForm: FormGroup;
  public height: number;
  public isEdit = false;
  public stopDrag = false;

  private subscribers: Subscription[] = [];
  private listener = () => {};

  @HostListener('mousedown', ['$event'])
  hello(event) {
    this.checkDialog(event);
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private httpService: HttpService,
    public dialog: MatDialog,
    private store$: Store,
  ) {
    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(1)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(1)
      ]),
    });

    this.columnForm = new FormGroup({
      titleColumn: new FormControl('', [
        Validators.required,
        Validators.minLength(1)
      ])
    });
    this.checkDialog = this.checkDialog.bind(this);
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(subscriber => {
      subscriber.unsubscribe();
    });
    this.listener();
  }

  drop(event: CdkDragDrop<Task[], any>) {
    const {container, previousContainer, currentIndex, previousIndex} = event;
    const dto = (task, i) => {
      task.order = i;
      task.columnId = this.column.id;
      return task;
    };

    if (previousContainer === container) {
      moveItemInArray(container.data, previousIndex, currentIndex);
      if (currentIndex !== previousIndex) {
        const tasks = container.data.map(dto);
        const sub1 = this.httpService.updateManyTask(tasks)
          .subscribe({
            error: () => {
              moveItemInArray(previousContainer.data, currentIndex, previousIndex);
            }
          });
        this.subscribers.push(sub1);
      }
    } else {
      transferArrayItem(previousContainer.data,
        container.data,
        previousIndex,
        currentIndex);
      const tasks = container.data.map(dto);
      const sub2 = this.httpService.updateManyTask(tasks)
        .subscribe({
          error: () => {
            transferArrayItem(
              event.container.data,
              event.previousContainer.data,
              event.currentIndex,
              event.previousIndex,
            );
          }
        });
      this.subscribers.push(sub2);
    }
  }

  dragStart(event: CdkDragStart) {
    this.height = event.source.element.nativeElement.offsetHeight;
  }

  addTaskShowDialog() {
    if (this.isTaskAdd) {
      this.taskAdd.emit(false);
    } else {
      this.taskAdd.emit(true);
    }

    this.listener = this.renderer.listen(this.document, 'mousedown', this.checkDialog);
    this.isShowAddTaskDialog = true;
  }

  closeAddTask() {
    this.isShowAddTaskDialog = false;
    this.form.reset();
  }

  createTask(): void {
    if (this.form.valid) {
      const task: Task = this.form.value;
      task.columnId = this.column.id;
      const subscriber = this.httpService.createTask(task).subscribe(res => {
        this.newTask.emit(res);
        this.closeAddTask();
      });
      this.subscribers.push(subscriber);
    }
  }

  checkDialog({target}) {
    if (!this.addTaskContainer.nativeElement.contains(target)) {
      this.taskAdd.emit(false);
      this.listener();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isTaskAdd && this.isShowAddTaskDialog && this.form.invalid) {
      this.closeAddTask();
    }

    if (!changes.isTaskAdd?.currentValue) {
      if (this.isShowAddTaskDialog) {
        this.createTask();
      }
    }
  }

  startEdit(): void {
    if (!this.isEditColumn) {
      this.editColumn.emit(true);
      this.isEdit = true;
      setTimeout(() => {
        this.columnTitle?.nativeElement?.focus();
      }, 0);
      this.columnForm.setValue({
        titleColumn: this.column.title
      });
    }
  }

  stopEdit(): void {
    this.editColumn.emit(false);
    this.isEdit = false;
  }

  updateColumn(): void {
    let title = '';

    if (this.columnForm.valid) {
      this.board.columns.forEach((column, i) => {
        delete column.tasks;
        column.order = i;
        if (column.id === this.column.id) {
          title = this.columnForm.value.titleColumn;
          column.title = title;
        }
      });

      if (this.column.title === title) {
        this.stopEdit();
      } else {
        const subscriber = this.httpService.updateBoard(this.board).subscribe(() => {
          this.column.title = title;
          this.stopEdit();
        });
        this.subscribers.push(subscriber);
      }
    }
  }

  deleteColumn(): void {
    const dialogRef = this.dialog.open(AskDialogComponent, {
      data: 'Column',
      width: '200px'
    });

    const dialogSub = dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        let tasksIds: string[] = [];

        this.board.columns = this.board.columns.filter((column, i) => {

          if (this.column?.tasks.length) {
            tasksIds = this.column.tasks.map(task => task.id);
          }

          delete column.tasks;
          column.order = i;
          return column.id !== this.column.id;
        });

        const tasksForDelete: Observable<null>[] = tasksIds.map(id => this.httpService.deleteTask(id));

        const subscriber = zip<Array<Board | null>>(this.httpService.updateBoard(this.board), ...tasksForDelete)
          .subscribe(response => {
            response.forEach(res => {
              if (res) {
                this.store$.dispatch(new UpdateBoardAction(res));
              }
            });
          });
        this.subscribers.push(subscriber);
      }
    });
    this.subscribers.push(dialogSub);
  }

  isEditTask(value: boolean) {
    this.stopDrag = value;
    this.editColumn.emit(value);
  }
}
