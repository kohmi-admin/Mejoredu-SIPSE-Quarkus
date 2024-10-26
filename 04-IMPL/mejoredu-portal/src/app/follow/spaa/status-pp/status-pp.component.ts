import { Component, OnDestroy } from '@angular/core';
import { TabsControlService } from './services/tabs-control.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-status-pp',
  templateUrl: './status-pp.component.html',
  styleUrls: ['./status-pp.component.scss'],
})
export class StatusPpComponent implements OnDestroy {
  project: number = 0;
  activity: number = 0;
  product: number = 0;
  notifier: Subject<any> = new Subject<any>();
  tabIndex: number = 0;

  constructor(private _tabsControlService: TabsControlService) {
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
    this._tabsControlService.updateProduct
      .pipe(takeUntil(this.notifier))
      .subscribe((value: number) => {
        this.product = value;
        this.tabIndex = 3;
      });
  }

  updateTab(index: number): void {
    this.tabIndex = index;
  }

  ngOnDestroy(): void {
    this.notifier.complete();
  }
}
