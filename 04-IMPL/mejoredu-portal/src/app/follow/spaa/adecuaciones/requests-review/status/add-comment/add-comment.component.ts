import { Component, Inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { QuestionControlService } from '@common/form/services/question-control.service';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
})
export class AddCommentComponent {
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];

  constructor(
    private _formBuilder: QuestionControlService,
    public dialogRef: MatDialogRef<AddCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
    const questions: QuestionBase<any>[] = [
      new TextareaQuestion({
        nane: 'comment',
        label: 'Comentario',
        value: data?.comment,
        validators: [Validators.required],
      }),
    ];
    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  submit() {
    if (this.form.valid) {
      if (this.data) {
        this.data.comment = this.form.value.comment;
        this.dialogRef.close(this.data);
      } else {
        this.dialogRef.close(this.form.value);
      }
    }
  }
}
