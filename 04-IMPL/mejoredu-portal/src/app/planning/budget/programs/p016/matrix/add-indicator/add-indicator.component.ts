import { Component, Inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { StateViewService } from 'src/app/planning/budget/services/state-view.service';
import { P016MirService } from '@common/services/budget/p016/mir.service';
import {
  IItemP016MIRMatriz,
  IRegisterMIR,
} from '@common/interfaces/budget/p016/mir.interface';
import { lastValueFrom } from 'rxjs';
import { AlertService } from '@common/services/alert.service';

@Component({
  selector: 'app-add-indicator',
  templateUrl: './add-indicator.component.html',
  styleUrls: ['./add-indicator.component.scss'],
})
export class AddIndicatorComponent {
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  editable = true;
  validation = false;

  constructor(
    public dialogRef: MatDialogRef<AddIndicatorComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      allItems: IItemP016MIRMatriz[];
      data: IItemP016MIRMatriz;
      index: number;
      year: string;
    },
    private _formBuilder: QuestionControlService,
    private _stateViewService: StateViewService,
    private p016MirService: P016MirService,
    private _alertService: AlertService
  ) {
    this.questions = [
      new TextboxQuestion({
        nane: 'nivel',
        label: 'Nivel',
        value: data.data.nivel,
        disabled: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextboxQuestion({
        nane: 'clave',
        label: 'Clave',
        value: data.data.clave,
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextareaQuestion({
        nane: 'resumenNarrativo',
        label: 'Resumen Narrativo',
      }),

      new TextareaQuestion({
        nane: 'nombreIndicador',
        label: 'Nombre del Indicador',
        validators: [Validators.required],
      }),

      new TextareaQuestion({
        nane: 'mediosVerificacion',
        label: 'Medios de Verificacón',
      }),

      new TextareaQuestion({
        nane: 'supuestos',
        label: 'Supuestos',
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    this.generateSequence();
    if (!this._stateViewService.editable) {
      this.form.disable();
      this.editable = false;
    }
    this.validation = this._stateViewService.validation;
  }

  generateSequence(): void {
    const clave = this.data.data.clave;
    // get numbers from clave
    let numbers: string = clave.substring(1, clave.length);
    // split numbers
    const numbersArray: string[] = numbers.split('.');
    // get last number
    const lastNumber = numbersArray[numbersArray.length - 1];
    // add 1 to last number
    const newNumber = Number(lastNumber) + 1;
    // replace last number
    numbersArray[numbersArray.length - 1] = newNumber.toString();
    // join numbers
    numbers = numbersArray.join('.');
    // replace numbers
    this.form.controls['clave'].setValue(clave.substring(0, 1) + numbers);
  }

  async submit(): Promise<void> {
    if (!this.form.valid) {
      this._alertService.showAlert('Favor de llenar los campos obligatorios');
      return;
    }
    let { index, year } = this.data;
    const allItems = this.data.allItems;
    const form: IItemP016MIRMatriz = this.form.getRawValue();
    const newIndicator: IItemP016MIRMatriz = {
      idIndicador: null,
      nivel: form.nivel,
      clave: form.clave,
      resumenNarrativo: form.resumenNarrativo,
      nombreIndicador: form.nombreIndicador,
      supuestos: form.supuestos,
      mediosVerificacion: form.mediosVerificacion,
    };
    allItems.splice(index + 1, 0, newIndicator);
    const data: IRegisterMIR = {
      idAnhio: Number(year),
      matriz: allItems,
    };
    try {
      await lastValueFrom(
        this.p016MirService.registerMirPorAnhio(data)
      );
      this.dialogRef.close(true);
    } catch (error) { }
  }
}
