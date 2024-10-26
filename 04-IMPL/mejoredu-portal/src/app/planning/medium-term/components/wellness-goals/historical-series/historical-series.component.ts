import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';

@Component({
  selector: 'app-historical-series',
  templateUrl: './historical-series.component.html',
  styleUrls: ['./historical-series.component.scss']
})
export class HistoricalSeriesComponent implements OnInit {
  @Input() editable: boolean = true;
  @Input() form!: FormGroup;
  formCurrent!: FormGroup;
  questions: QuestionBase<any>[] = [];
  questionsCurrent: QuestionBase<any>[] = [];
  years = [2012, 2013, 2014, 2015, 2016, 2017, 2018]
  @Output() emmitStep = new EventEmitter<number>();
  constructor(
    private _formBuilder: QuestionControlService,
  ) {
    this.questions = [];

    for (var i = 0; i < 7; i++) {
      this.questions.push(
        new DropdownQuestion({
          nane: 'date' + (i + 1),
          label: 'Fecha',
          options: this.years.map(item => {
            return {
              id: item,
              value: item + ''
            }
          }),
          validators: [Validators.required],
        }),
      );
    }

    for (var i = 0; i < 7; i++) {
      this.questions.push(
        new TextboxQuestion({
          nane: 'percent' + (i + 1),
          label: 'Porcentaje',
          type: 'number',
          validators: [Validators.required, Validators.maxLength(5)],
        }),
      );
    }

    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  ngOnInit(): void {
    if (!this.editable) {
      this.form.disable();
      this.formCurrent?.disable();
    }
  }

  changeStep(add: number) {
    this.emmitStep.emit(add);
  }

  submit(): void {
  }
}
