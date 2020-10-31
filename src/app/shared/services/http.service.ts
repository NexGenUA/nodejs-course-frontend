import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Board } from '../models/board.model';
import { environment } from '../../../environments/environment';
import { EMPTY, Observable, zip } from 'rxjs';
import { Task } from '../models/task.model';
import { selectBoardId } from '../../store/selectors/router.selector';
import { select, Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class HttpService {
  private boardId: string;
  public boardId$: Observable<string> = this.store$.pipe(select(selectBoardId));
  constructor(
    private http: HttpClient,
    private store$: Store
  ) {
    this.boardId$.subscribe(boardId => {
      this.boardId = boardId;
    });
  }

  loadBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${environment.apiUrl}/boards`);
  }

  updateBoard(board: Board): Observable<Board> {
    return this.http.put<Board>(`${environment.apiUrl}/boards/${this.boardId}`, board);
  }

  getBoard(): Observable<Board> {
    if (this.boardId) {
      return this.http.get<Board>(`${environment.apiUrl}/boards/${this.boardId}`);
    }
    return EMPTY;
  }

  createBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(`${environment.apiUrl}/boards/`, board);
  }

  deleteBoard(id: string): Observable<null> {
    return this.http.delete<null>(`${environment.apiUrl}/boards/${id}`);
  }

  getTasksByBoardId(id: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.apiUrl}/boards/${id}/tasks`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${environment.apiUrl}/boards/${this.boardId}/tasks`, task);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${environment.apiUrl}/boards/${this.boardId}/tasks/${task.id}`, task);
  }

  deleteTask(taskId: string): Observable<null> {
    return this.http.delete<null>(`${environment.apiUrl}/boards/${this.boardId}/tasks/${taskId}`);
  }

  updateManyTask(tasks: Task[]): Observable<Task[]> {
    const toUpdate = tasks.map(task => this.updateTask(task));
    return zip(...toUpdate);
  }
}
