import { Component, Inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { StateViewService } from 'src/app/planning/short-term/services/state-view.service';

@Component({
  selector: 'app-registry-indicators-tab',
  templateUrl: './registry-indicators-tab.component.html',
  styleUrls: ['./registry-indicators-tab.component.scss']
})
export class RegistryIndicatorsTabComponent {
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  editable = true;
  validation = false;
  constructor(
    public dialogRef: MatDialogRef<RegistryIndicatorsTabComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: QuestionControlService,
    private _stateViewService: StateViewService,
  ) {
    this.questions = [
      new DropdownQuestion({
        nane: 'tipoIndicador',
        label: 'Tipo Indicador',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Actividad'
          },
          {
            id: 2,
            value: 'Componente'
          },
        ],
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextboxQuestion({
        nane: 'nivelIndicador',
        label: 'Nivel Indicador',
        value: data.name,
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextboxQuestion({
        nane: 'claveIndicador',
        label: 'Clave',
        value: data.name,
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextboxQuestion({
        nane: 'nombreIndicador',
        label: 'Nombre del Indicador',
        value: data.name,
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextareaQuestion({
        nane: 'resumenNarrativo',
        label: 'Resumen Narrativo',
        value: data.name,
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextareaQuestion({
        nane: 'mediosVerificacion',
        label: 'Medios Verificación',
        value: data.name,
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextareaQuestion({
        nane: 'supuestos',
        label: 'Supuestos',
        value: data.name,
        validators: [Validators.required, Validators.maxLength(100)],
      }),

    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    /* if (!this._stateViewService.editable) {
      this.form.disable();
      this.editable = false;
    }
    this.validation = this._stateViewService.validation; */
  }
}
