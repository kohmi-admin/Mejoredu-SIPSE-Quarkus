import { Component, OnDestroy } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { MessageService } from '@common/message/message.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-work-space',
  templateUrl: './work-space.component.html',
  styleUrls: ['./work-space.component.scss']
})
export class WorkSpaceComponent implements OnDestroy {
  notifier = new Subject();
  form!: FormGroup;
  formUnchanged = true;
  questions: QuestionBase<string>[] = [];
  private _body = document.querySelector('body');

  constructor(
    private _formBuilder: QuestionControlService,
    private _messageService: MessageService,
  ) {
    this._body?.classList.add('hideW');
    this.questions = [
      new TextareaQuestion({
        nane: 'name',
        label: 'Espacio de Trabajo',
        message: 'Alfanumérico, 50000 Caracteres de Longitud',
        validators: [Validators.required, Validators.maxLength(50000)],
      }),
    ];

    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.valueChanges
    .pipe(takeUntil(this.notifier)).subscribe(() => {
      this.formUnchanged = false;
    });
  }

  submit() {
    if (this.form.valid) {
      this._messageService.showMessage('Registro Guardado con Éxito', 'Cerrar');
    }
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
  }
}
