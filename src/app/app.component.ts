import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getSpinner } from './store/selectors/spinner.selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewChecked {
  spinner$: Observable<boolean> = this.store$.pipe(select(getSpinner));

  constructor(
    private store$: Store,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
}
