import { Component, OnDestroy } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnDestroy {
  notifier = new Subject();
  form!: FormGroup;
  formUnchanged = true;
  questions: QuestionBase<string>[] = [];
  private _body = document.querySelector('body');

  constructor(private _formBuilder: QuestionControlService) {
    this._body?.classList.add('hideW');
    this.questions = [
      new TextboxQuestion({
        nane: 'name',
        label: 'Nombre de la Unidad',
        icon: 'help',
        message: 'Alfanumérico, 80 Caracteres de Longitud',
        validators: [Validators.required, Validators.maxLength(80)],
      }),

      new TextboxQuestion({
        nane: 'clave',
        label: 'Clave',
        icon: 'help',
        message: 'Alfanumérico, 8 Caracteres de Longitud',
        validators: [Validators.required, Validators.maxLength(8)],
      }),

      new TextboxQuestion({
        nane: 'objetivo',
        label: 'Objetivo',
        icon: 'help',
        message: 'Alfanumérico, 180 Caracteres de Longitud',
        validators: [Validators.required, Validators.maxLength(180)],
      }),

      new TextareaQuestion({
        nane: 'fund',
        label: 'Fundamentación',
        icon: 'help',
        message: 'Alfanumérico, 500 Caracteres de Longitud',
        validators: [Validators.required, Validators.maxLength(500)],
      }),

      new TextareaQuestion({
        nane: 'alcance',
        label: 'Alcance',
        icon: 'help',
        message: 'Alfanumérico, 500 Caracteres de Longitud',
        validators: [Validators.required, Validators.maxLength(500)],
      }),

      new TextboxQuestion({
        nane: 'objetivoPI',
        label: 'Contribución al Objetivo Prioritario de PI ',
        icon: 'help',
        message: 'Alfanumérico, 100 Caracteres de Longitud',
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextboxQuestion({
        nane: 'objetivoPND',
        label: 'Contribución a Programas Especiales Derivados del PND ',
        icon: 'help',
        message: 'Alfanumérico, 100 Caracteres de Longitud',
        validators: [Validators.required, Validators.maxLength(100)],
      }),
    ];

    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.valueChanges.pipe(takeUntil(this.notifier)).subscribe(() => {
      this.formUnchanged = false;
    });
  }
  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return this.formUnchanged;
  }
}
