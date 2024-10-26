import { Component, DoCheck, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { QuestionBase } from '../classes/question-base.class';
import { FormControl, FormGroup } from '@angular/forms';
import { getErrorMessage } from '../classes/error-message.class';
import { OptionI } from '../interfaces/option.interface';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss']
})
export class SelectFilterComponent implements OnInit, OnDestroy {
  @Input() class = '';
  @Input() question!: QuestionBase<any>;
  @Input() form!: FormGroup;
  public optionCtrl: FormControl<OptionI | null> = new FormControl<OptionI | null>(null);
  public optionFilterCtrl: FormControl<string | null> = new FormControl<string>('');
  public optionsFilter: ReplaySubject<OptionI[]> = new ReplaySubject<OptionI[]>(1);
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
  protected _onDestroy = new Subject<void>();

  get isValid() {
    return this.form.controls[this.question.nane].valid;
  }

  get errorMessage() {
    return getErrorMessage(this.question.label, this.form.controls[this.question.nane]);
  }

  load() {
    this.optionsFilter.next(this.question.optionsArray.slice());
  }

  ngOnInit() {
    this.optionsFilter.next(this.question.optionsArray.slice());
    this.optionFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOptions();
      });
    this.question.optionsUpdate
      .pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.load();
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterOptions() {
    if (!this.question.optionsArray) {
      return;
    }
    // get the search keyword
    let search = this.optionFilterCtrl.value;
    if (!search) {
      this.optionsFilter.next(this.question.optionsArray.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the question.options
    this.optionsFilter.next(
      this.question.optionsArray.filter(option => option.value.toLowerCase().indexOf(search || '') > -1)
    );
  }
}
