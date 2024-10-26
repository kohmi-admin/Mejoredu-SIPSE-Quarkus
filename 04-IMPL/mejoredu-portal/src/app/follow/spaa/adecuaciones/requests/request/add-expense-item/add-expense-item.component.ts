import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExpenseItemI } from './interfaces/expensive-item.interface';
import { OptionI } from '@common/form/interfaces/option.interface';
import { forkJoin, take } from 'rxjs';
import { CatalogsService } from '@common/services/catalogs.service';
import { environment } from 'src/environments/environment';
import { ICatalogResponse } from '@common/interfaces/catalog.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { AlertService } from '@common/services/alert.service';

@Component({
  selector: 'app-add-expense-item',
  templateUrl: './add-expense-item.component.html',
  styleUrls: ['./add-expense-item.component.scss'],
})
export class AddExpenseItemComponent {
  public optionFilterCtrl: FormControl<string | null> = new FormControl<string>(
    ''
  );
  expensiveItems: ExpenseItemI[] = [
  ];

  expensiveItem: any =
    {
      importe: 0,
      reduccion: false,
      ampleacion: false,
    };

  mounts: OptionI[] = [
    {
      id: 1,
      value: 'Enero',
    },
    {
      id: 2,
      value: 'Febrero',
    },
    {
      id: 3,
      value: 'Marzo',
    },
    {
      id: 4,
      value: 'Abril',
    },
    {
      id: 5,
      value: 'Mayo',
    },
    {
      id: 6,
      value: 'Junio',
    },
    {
      id: 7,
      value: 'Julio',
    },
    {
      id: 8,
      value: 'Agosto',
    },
    {
      id: 9,
      value: 'Septiembre',
    },
    {
      id: 10,
      value: 'Octubre',
    },
    {
      id: 11,
      value: 'Noviembre',
    },
    {
      id: 12,
      value: 'Diciembre',
    },
  ];
  catPartidasPresupuestales!: ICatalogResponse;

  form!: FormGroup;
  questions: QuestionBase<any>[] = [];

  constructor(
    private _formBuilder: QuestionControlService,
    private _alertService: AlertService,

    public dialogRef: MatDialogRef<AddExpenseItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private catalogService: CatalogsService
  ) {
    this.getCatalogs();
    this.questions = [];

    this.questions.push(
      new DropdownQuestion({
        nane: 'partidaPresupuestal',
        label: 'Nombre de la Partida de Gasto',
        filter: true,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'mes',
        label: 'Mes',
        filter: true,
        options: this.mounts,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new TextboxQuestion({
        nane: 'clavePresupuestal',
        label: 'Clave Presupuestal',
        validators: [Validators.required],
      })
    );

    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  async getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['catalogoPartidasPresupuestales']
      ),
    ])
      .pipe(take(1))
      .subscribe(([dataCatalogoPartidasPresupuestales]) => {
        this.catPartidasPresupuestales = dataCatalogoPartidasPresupuestales;
        this.questions[0].options = mapCatalogData({
          data: dataCatalogoPartidasPresupuestales,
        });
      });
  }

  someReductionActive(id: number): boolean {
    return this.expensiveItems.some((item) => item.reduccion && item.id !== id);
  }

  someAmpleacionActive(id: number): boolean {
    return this.expensiveItems.some(
      (item) => item.ampleacion && item.id !== id
    );
  }

  apply(): void {
    const { partidaPresupuestal, mes, clavePresupuestal  } = this.form.getRawValue();

    if(partidaPresupuestal && mes && clavePresupuestal && this.expensiveItem.importe && (this.expensiveItem.reduccion || this.expensiveItem.ampleacion)){
      this.expensiveItems.push({
        nombrePartidaGasto: this.catPartidasPresupuestales.catalogo.filter((item) => item.idCatalogo === partidaPresupuestal)[0].cdDescripcionDos,
        idPartidaGasto: partidaPresupuestal,
        importe: this.expensiveItem.importe,
        mesId: mes,
        mes: this.mounts.filter(item => item.id === mes)[0].value,
        clavePresupuestal: clavePresupuestal,
        reduccion: this.expensiveItem.reduccion,
        ampleacion: this.expensiveItem.ampleacion
      })
      const getOnliActive = this.expensiveItems.filter(
        (item) => item.reduccion || item.ampleacion
      );
      this.dialogRef.close(getOnliActive);
    } else {
      this._alertService.showAlert(
        'Es necesario completar los datos de la partida'
      );
    }

  }
}
