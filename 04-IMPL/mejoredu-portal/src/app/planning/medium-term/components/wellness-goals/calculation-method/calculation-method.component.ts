import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';

@Component({
  selector: 'app-calculation-method',
  templateUrl: './calculation-method.component.html',
  styleUrls: ['./calculation-method.component.scss']
})
export class CalculationMethodComponent implements OnInit {
  @Input() editable: boolean = true;
  @Input() form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  @Output() emmitStep = new EventEmitter<number>();

  constructor(
    private _formBuilder: QuestionControlService,
  ) {
    this.questions = [
      new TextboxQuestion({
        nane: 'varName1',
        label: 'Nombre Variable 1',
        validators: [Validators.required],
      }),

      new TextboxQuestion({
        nane: 'valVar1',
        label: 'Valor Variable 1',
        validators: [Validators.required],
      }),

      new TextboxQuestion({
        nane: 'fuenteInformacionVariable1',
        label: 'Fuente de Información Variable 1',
        validators: [Validators.required, Validators.maxLength(50)],
      }),

      new TextboxQuestion({
        nane: 'varName2',
        label: 'Nombre Variable 2',
        validators: [Validators.required],
      }),

      new TextboxQuestion({
        nane: 'valVar2',
        label: 'Valor Variable 2',
        validators: [Validators.required],
      }),

      new TextboxQuestion({
        nane: 'fuenteInformacionVariable2',
        label: 'Fuente de Información Variable 2',
        validators: [Validators.required, Validators.maxLength(50)],
      }),

      new TextareaQuestion({
        nane: 'sustutucionMetodoCalculoIndicador',
        label: 'Sustitución en Método de Cálculo del Indicador',
        validators: [Validators.required, Validators.maxLength(300)],
      })
    ];

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
