import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Board } from '../../models/board.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { paths } from '../../constants/constants';
import { Store } from '@ngrx/store';
import { CreateBoardAction } from '../../../store/actions/board.action';

@Component({
  selector: 'app-add-board-dialog',
  templateUrl: './add-board-dialog.component.html',
  styleUrls: ['./add-board-dialog.component.scss']
})
export class AddBoardDialogComponent implements OnDestroy{
  public form: FormGroup;

  private subscribers: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddBoardDialogComponent>,
    private httpService: HttpService,
    private router: Router,
    private store$: Store,
  ) {
    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.minLength(1),
        Validators.required
      ])
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createBoard() {
    if (this.form.valid) {
      const newBoard: Board = {
        title: this.form.get('title').value,
        columns: [],
      };
      const subscriber = this.httpService.createBoard(newBoard).subscribe(board => {
        this.store$.dispatch(new CreateBoardAction(board));
        this.router.navigate([paths.BOARD, board.id]).then(() => {
          this.dialogRef.close();
        });
      }, () => {});
      this.subscribers.push(subscriber);
    }
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(subscriber => {
      subscriber.unsubscribe();
    });
  }
}
