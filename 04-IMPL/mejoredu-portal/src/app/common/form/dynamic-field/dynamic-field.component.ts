import { Component, Input } from '@angular/core';
import { QuestionBase } from '../classes/question-base.class';
import { FormGroup } from '@angular/forms';
import { getErrorMessage } from '../classes/error-message.class';

@Component({
  selector: 'app-dynamic-field',
  templateUrl: './dynamic-field.component.html',
  styleUrls: ['./dynamic-field.component.scss'],
})
export class DynamicFieldComponent {
  @Input() class = '';
  @Input() question!: QuestionBase<any>;
  @Input() form!: FormGroup;

  constructor() { }

  get isValid() {
    return this.form.controls[this.question.nane].valid;
  }

  get errorMessage() {
    return getErrorMessage(this.question.label, this.form.controls[this.question.nane]);
  }

}
