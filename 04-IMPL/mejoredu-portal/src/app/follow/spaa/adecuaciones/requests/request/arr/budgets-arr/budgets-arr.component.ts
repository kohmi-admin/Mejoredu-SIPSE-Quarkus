import { Component } from '@angular/core';
import { ReductionEnlargement } from '../../add-expense-item/classes/reduction-enlargement.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { Validators } from '@angular/forms';
import { CheckboxQuestion } from '@common/form/classes/question-checkbox.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { AddExpenseItemComponent } from '../../add-expense-item/add-expense-item.component';
import { MatDialog } from '@angular/material/dialog';
import { BudgetCalendarI } from './interface/budget-calendar.interface';

@Component({
  selector: 'app-budgets-arr',
  templateUrl: './budgets-arr.component.html',
  styleUrls: ['./budgets-arr.component.scss'],
})
export class BudgetsArrComponent extends ReductionEnlargement {
  budgetCalendar: BudgetCalendarI[] = [
    {
      status: 'Aprobado',
      total: 0,
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
    }
  ];

  constructor(
    private _formBuilder: QuestionControlService,
    private dialog: MatDialog,
    
  ) {
    super(dialog, AddExpenseItemComponent);

    this.questions = [];

    this.questions.push(
      new TextboxQuestion({
        disabled: true,
        nane: 'Unidad',
        label: 'Unidad',
        value: '2100 Unidad de Evaluación Diagnóstica',
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new TextboxQuestion({
        disabled: true,
        nane: 'clave',
        label: 'Clave del Proyecto',
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'NombredelProyecto',
        label: 'Nombre del Proyecto',
        filter: true,
        options: [
          {
            id: 1,
            value:
              'Estudios, investigaciones especializadas y evaluaciones diagnósticas, formativas e integrales',
          },
          {
            id: 2,
            value:
              'Difusión de productos institucionales que contribuyan a la mejora educativa',
          },
          {
            id: 3,
            value:
              'Colaboración con autoridades educativas, instituciones y actores clave',
          },
        ],
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'Nombre de la Actividad',
        label: 'Nombre de la Actividad',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Actividad 001',
          },
          {
            id: 2,
            value: 'Actividad 002',
          },
          {
            id: 3,
            value: 'Actividad 003',
          },
        ],
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'Nombre del Producto',
        label: 'Nombre del Producto',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Producto 001',
          },
          {
            id: 2,
            value: 'Producto 002',
          },
          {
            id: 3,
            value: 'Producto 003',
          },
        ],
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new TextboxQuestion({
        nane: 'Clave del Nivel Educativo',
        label: 'Clave del Nivel Educativo',
        disabled: true,
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new TextboxQuestion({
        disabled: true,
        nane: 'Clave de la Acción',
        label: 'Clave de la Acción',
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new TextboxQuestion({
        nane: 'Nombre de la Acción',
        label: 'Nombre de la Acción',
        filter: true,
        options: [{
          id: 1,
          value: 'Acción 001',
        }],
        validators: [Validators.required, Validators.maxLength(90)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'ID Centro de Costos',
        label: 'ID Centro de Costos',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Opción 1',
          },
          {
            id: 2,
            value: 'Opción 2',
          },
        ],
        validators: [Validators.required],
      })
    );

    // Presupuesto
    this.questions.push(
      new CheckboxQuestion({
        nane: 'Presupuesto',
        label: 'Presupuesto',
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'Partida de Gasto',
        label: 'Partida de Gasto',
        filter: true,
        disabled: true,
        multiple: true,
        options: [
          {
            id: 1,
            value: 'Haberes',
          },
          {
            id: 2,
            value: 'Sueldos Base',
          },
          {
            id: 3,
            value: 'Retribuciones por adscripción en el extranjero',
          },
          {
            id: 4,
            value: 'Honorarios',
          },
          {
            id: 5,
            value: 'Sueldos base al personal eventual',
          },
          {
            id: 6,
            value: 'Compensaciones a sustitutos de profesores',
          },
          {
            id: 7,
            value: 'Retribuciones por servicios de carácter social',
          },
          {
            id: 8,
            value:
              'Retribución a los representantes de los trabajadores y de los patrones en la Junta Federal de Conciliación y Arbitraje',
          },
          {
            id: 9,
            value: 'Prima quinquenal por años de servicios efectivos prestados',
          },
          {
            id: 10,
            value:
              'Acreditación por años de servicio en la docencia y al personal administrativo de las instituciones de educación superior',
          },
        ],
        validators: [Validators.required],
      })
    );

    // this.questions.push(
    //   new TextboxQuestion({
    //     nane: 'Presupuesto Anual',
    //     label: 'Presupuesto Anual',
    //     disabled: true,
    //     type: 'number',
    //     validators: [Validators.required, Validators.maxLength(15)],
    //   }),
    // );

    this.questions.push(
      new DropdownQuestion({
        nane: 'Fuente de Financiamiento',
        label: 'Fuente de Financiamiento',
        filter: true,
        disabled: true,
        options: [
          {
            id: 1,
            value: 'Opción 1',
          },
          {
            id: 2,
            value: 'Opción 2',
          },
        ],
        validators: [Validators.required],
      })
    );

    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.get('Presupuesto')?.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.form.get('Partida de Gasto')?.enable();
        this.form.get('Presupuesto Anual')?.enable();
        this.form.get('Fuente de Financiamiento')?.enable();
      } else {
        this.form.get('Partida de Gasto')?.disable();
        this.form.get('Presupuesto Anual')?.disable();
        this.form.get('Fuente de Financiamiento')?.disable();
      }
    });
  }

  submit(): void {
  }
}
