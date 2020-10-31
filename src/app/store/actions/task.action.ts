import { Action } from '@ngrx/store';
import { taskActionType, TaskState } from '../state.model';

export class GetTasksByIdAction implements Action {
  readonly type: string = taskActionType.getTasks;
  constructor(public payload: string) { }
}

export class LoadTasksAction implements Action {
  readonly type: string = taskActionType.loadTasks;
  constructor(public payload: TaskState) { }
}

export type TaskActions = GetTasksByIdAction | LoadTasksAction;
