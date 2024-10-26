import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { SaveUpdateFileComponent } from 'src/app/planning/short-term/annual-project/form/upload/save-update/save-update.component';

@Component({
  selector: 'app-justification',
  templateUrl: './justification.component.html',
  styleUrls: ['./justification.component.scss'],
})
export class JustificationComponent {
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];

  constructor(
    public dialogRef: MatDialogRef<SaveUpdateFileComponent>,
    private _formBuilder: QuestionControlService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const questions: QuestionBase<any>[] = [
      new TextareaQuestion({
        nane: 'causas',
        label: 'Causas',
        value: data?.causas ?? '',
        validators: [],
      }),
      new TextareaQuestion({
        nane: 'efectos',
        label: 'Efectos',
        value: data?.efectos ?? '',
        validators: [],
      }),
      new TextareaQuestion({
        nane: 'otrosMotivos',
        label: 'Otros motivos',
        value: data?.otrosMotivos ?? '',
        validators: [],
      }),
    ];
    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  submit() {
    this.dialogRef.close(this.form.getRawValue());
  }
}
