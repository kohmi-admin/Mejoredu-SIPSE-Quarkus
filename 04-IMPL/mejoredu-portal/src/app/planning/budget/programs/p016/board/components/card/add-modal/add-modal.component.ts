import { Component, Inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { CardI } from '../../../interfaces/card.interface';
import { CardService } from '../services/card.service';
import { Essential } from '../classes/essential.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss']
})
export class AddModalComponent extends Essential {
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CardI,
    private _questionService: QuestionControlService,
    private _dialogRef: MatDialogRef<AddModalComponent>,
    private cardService: CardService,
  ) {
    super(cardService);
    this.card = data;
    const questions: any = [];

    questions.push(new TextareaQuestion({
      label: 'Descripción',
      nane: 'description',
      value: this.card.description,
      validators: [Validators.required],
    }));

    this.questions = questions;
    this.form = this._questionService.toFormGroup(questions);
  }

  save(): void {
    if (this.form.invalid) return;
    this._dialogRef.close(this.form.value);
  }

}
