import { Component, Inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';

@Component({
  selector: 'app-save-update',
  templateUrl: './save-update.component.html',
  styleUrls: ['./save-update.component.scss'],
})
export class SaveUpdateFileComponent {
  loading = false;
  title = 'Agregar Archivo';
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];

  constructor(
    public dialogRef: MatDialogRef<SaveUpdateFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: QuestionControlService
  ) {
    if (data) {
      this.title = 'Modificar Archivo';
    }

    const questions: any = [];

    questions.push(
      new TextboxQuestion({
        nane: 'name',
        label: 'Nombre del archivo',
        value: data?.name,
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'clave',
        label: 'Clave ',
        value: data?.clave,
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'objetivo',
        label: 'Objetivo ',
        value: data?.objetivo,
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'objPrioritario',
        label: 'Objetivo Prioritario ',
        value: data?.objPrioritario,
        validators: [Validators.required],
      })
    );

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  async submit(): Promise<void> {
    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    this.form.disable();
    if (this.data) {
      await this._update();
    } else {
      await this._create();
    }
    this.form.enable();
    this.loading = false;
  }

  private async _create(): Promise<void> {
    try {
      this.dialogRef.close(true);
    } catch (error: any) { }
  }

  private async _update(): Promise<void> {
    try {
      this.dialogRef.close(true);
    } catch (error: any) { }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
