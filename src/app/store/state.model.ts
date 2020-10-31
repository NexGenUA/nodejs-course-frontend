import { Board } from '../shared/models/board.model';
import { User } from '../shared/models/user.model';
import { DEFAULT_ROUTER_FEATURENAME, RouterReducerState } from '@ngrx/router-store';
import { Params } from '@angular/router';
import { Column } from '../shared/models/column.model';
import { Task } from '../shared/models/task.model';

export interface State {
  board: BoardState;
  user: UserState;
  column: ColumnState;
  task: TaskState;
  [DEFAULT_ROUTER_FEATURENAME]: RouterReducerState;
  spinner: SpinnerState;
}

export interface BoardState {
  items: Board[];
}

export interface ColumnState {
  items: Column[];
}

export interface TaskState {
  items: Task[];
}

export interface UserState {
  user: User;
  error: string;
  token: string;
}

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
}

export interface SpinnerState {
  isLoad: boolean;
}

export enum nodes {
  board = 'board',
  column = 'column',
  task = 'task',
  user = 'user',
  spinner = 'spinner',
}

export enum boardActionType {
  loadBoards = '[BOARDS] load',
  getBoards = '[BOARDS] get',
  updateBoard = '[BOARDS] update',
  createBoard = '[BOARDS] create',
  resetBoard = '[BOARDS] reset',
}

export enum columnActionType {
  getColumnsById = '[COLUMN] getById',
  getColumns = '[COLUMN] get',
}

export enum taskActionType {
  getTasks = '[TASK] getTasks',
  loadTasks = '[TASK] loadTasks',
}

export enum userActionType {
  saveUser = '[USER] - save',
  clearUser = '[USER] - clear',
  setToken = '[USER] - token',
}

export enum spinnerActionType {
  spinnerOn = '[SPINNER] ON',
  spinnerOff = '[SPINNER] OFF',
}
