import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TabsControlService } from './services/tabs-control.service';

@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss'],
})
export class RevisionComponent {
  project: number = 0;
  activity: number = 0;
  product: number = 0;
  notifier: Subject<any> = new Subject<any>();
  tabIndex: number = 0;
  currentQuarter: number = 1;

  constructor(private _tabsControlService: TabsControlService) {
    this.getCurrentQuarter();
    this.project = this._tabsControlService.project;
    this.activity = this._tabsControlService.activity;
    this.product = this._tabsControlService.product;

    this._tabsControlService.updateProgect
      .pipe(takeUntil(this.notifier))
      .subscribe((value: number) => {
        this.project = value;
        this.tabIndex = 1;
      });
    this._tabsControlService.updateActivity
      .pipe(takeUntil(this.notifier))
      .subscribe((value: number) => {
        this.activity = value;
        this.tabIndex = 2;
      });
  }

  updateTab(index: number): void {
    this.tabIndex = index;
  }

  getCurrentQuarter() {
    const today = new Date();
    const month = today.getMonth();
    if (month < 3) {
      this.currentQuarter = 1;
    } else if (month < 6) {
      this.currentQuarter = 2;
    } else if (month < 9) {
      this.currentQuarter = 3;
    } else {
      this.currentQuarter = 4;
    }
  }

  ngOnDestroy(): void {
    this.notifier.complete();
  }
}
