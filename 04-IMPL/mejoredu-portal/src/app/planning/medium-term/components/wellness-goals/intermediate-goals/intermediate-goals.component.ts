import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';

@Component({
  selector: 'app-intermediate-goals',
  templateUrl: './intermediate-goals.component.html',
  styleUrls: ['./intermediate-goals.component.scss']
})
export class IntermediateGoalsComponent {
  @Input() editable: boolean = true;
  @Input() form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  years= [2018, 2019, 2020, 2021, 2022, 2023, 2024]
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
    }
  }

  changeStep(add: number) {
    this.emmitStep.emit(add);
  }

  submit(): void {
  }
}
