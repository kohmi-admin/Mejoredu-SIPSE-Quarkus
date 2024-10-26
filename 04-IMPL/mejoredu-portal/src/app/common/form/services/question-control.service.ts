import { Injectable } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { QuestionBase } from '../classes/question-base.class';

@Injectable()
export class QuestionControlService {
  toFormGroup(questions: QuestionBase<string | number>[] ) {
    const group: any = {};
    questions.forEach(question => {
      group[question.nane] = new FormControl({
        value: question.value === 0 ? Number(0) : question.value === false ? false : question.value || null,
        disabled: question.disabled,
      }, question.validators);
    });
    return new FormGroup(group);
  }
}
