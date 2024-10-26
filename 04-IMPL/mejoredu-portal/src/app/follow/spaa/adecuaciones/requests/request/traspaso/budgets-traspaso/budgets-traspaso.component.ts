import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TblWidthService } from '@common/services/tbl-width.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { ReductionEnlargement } from '../../add-expense-item/classes/reduction-enlargement.class';
import { AddExpenseItemComponent } from '../../add-expense-item/add-expense-item.component';

@Component({
  selector: 'app-budgets-traspaso',
  templateUrl: './budgets-traspaso.component.html',
  styleUrls: ['./budgets-traspaso.component.scss'],
})
export class BudgetsTraspasoComponent
  extends ReductionEnlargement
  implements OnDestroy {
  @Output() setRecord: EventEmitter<any> = new EventEmitter<any>();
  loading = true;

  notifier = new Subject();
  formUnchanged = true;
  private _body = document.querySelector('body');
  money = 0;

  dataPP: any[] = [];
  validation = false;

  constructor(
    private _formBuilder: QuestionControlService,
    private dialog: MatDialog,
    private _tblWidthService: TblWidthService
  ) {
    super(dialog, AddExpenseItemComponent);
    this._body?.classList.add('hideW');

    this.questions = [];

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
      new DropdownQuestion({
        nane: 'Nombre de la Acción',
        label: 'Nombre de la Acción',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Acción 001',
          },
        ],
        validators: [Validators.required, Validators.maxLength(90)],
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
      new DropdownQuestion({
        nane: 'Nombre de la Acción',
        label: 'Nombre de la Acción',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Acción 001',
          },
        ],
        validators: [Validators.required, Validators.maxLength(90)],
      })
    );

    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.valueChanges.pipe(takeUntil(this.notifier)).subscribe(() => {
      this.formUnchanged = false;
    });
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

  getColWidth(widthLess: number, percent: number): number {
    return this._tblWidthService.getColWidth(widthLess, percent);
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return this.formUnchanged;
  }
}
