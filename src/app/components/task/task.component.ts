import { Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, Output, Renderer2, ViewChild } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { AskDialogComponent } from '../../shared/components/ask-dialog/ask-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { HttpService } from '../../shared/services/http.service';
import { select, Store } from '@ngrx/store';
import { GetColumnByIdAction } from '../../store/actions/column.action';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { User } from '../../shared/models/user.model';
import { getUser } from '../../store/selectors/user.selector';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnDestroy {
  @Input() task: Task;
  @Output() isEditTask: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('editTaskBlock') editTaskRef: ElementRef;

  subscribers: Subscription[] = [];
  isAuth: boolean = environment.auth;
  form: FormGroup;
  isShowEditTaskDialog = false;
  user$: Observable<User> = this.store$.pipe(select(getUser));
  userId: string;
  listener = () => { };

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private httpService: HttpService,
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
    const userIdSub = this.user$.subscribe(user => {
      if (user) {
        this.userId = user.id;
      }
    }, () => { });
    this.subscribers.push(userIdSub);
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(subscriber => {
      subscriber.unsubscribe();
    });
    this.listener();
  }

  editTask() {
    this.listener = this.renderer.listen(this.document, 'mousedown', ({target}) => {
      if (!this.editTaskRef.nativeElement.contains(target)) {
        this.updateTask();
      }
    });
    this.form.setValue({
      title: this.task.title,
      description: this.task.description
    });
    this.isShowEditTaskDialog = true;
    this.isEditTask.emit(true);
  }

  deleteTask() {
    const dialogRef = this.dialog.open(AskDialogComponent, {
      data: 'Task',
      width: '200px'
    });

    const dialogSub = dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        const deleteSub = this.httpService.deleteTask(this.task.id).subscribe(() => {
          this.store$.dispatch(new GetColumnByIdAction());
        }, () => {
        });
        this.subscribers.push(deleteSub);
      }
    });

    this.subscribers.push(dialogSub);
  }

  closeEditTask() {
    this.isShowEditTaskDialog = false;
    this.isEditTask.emit(false);
    this.listener();
  }

  updateTask() {
    const newTask: Task = this.form.value;
    const changed = (this.task.title !== newTask.title)
      || (this.task.description !== newTask.description);
    if (this.form.valid) {
      if (changed) {
        const updatedTask: Task = {...this.task, ...newTask};
        const updateSub = this.httpService.updateTask(updatedTask).subscribe(() => {
          this.store$.dispatch(new GetColumnByIdAction());
          this.closeEditTask();
        }, () => {
        });
        this.subscribers.push(updateSub);
      } else {
        this.closeEditTask();
      }
    }
  }

  assignTask(id: string): void {
    const updatedTask: Task = {...this.task, userId: id};
    const updateSub = this.httpService.updateTask(updatedTask).subscribe(() => {
      this.store$.dispatch(new GetColumnByIdAction());
    }, () => {
    });
    this.subscribers.push(updateSub);
  }
}
