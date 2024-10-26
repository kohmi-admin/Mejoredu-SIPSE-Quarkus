import { Component } from '@angular/core';
import { CommonStructure } from '@common/classes/common-structure.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { PeriodService } from './period.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateQuestion } from '@common/form/classes/question-date.class';
import * as moment from 'moment';

@Component({
  selector: 'app-period',
  templateUrl: './period.component.html',
  styleUrls: ['../configuration.component.scss', './period.component.scss'],
})
export class PeriodComponent extends CommonStructure {
  editable: boolean = true;
  range = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  });
  override columns: TableColumn[] = [
    { columnDef: 'moduloStr', header: 'Módulo', alignLeft: true },
    { columnDef: 'submoduloStr', header: 'Submódulo', alignLeft: true },
    { columnDef: 'opcionStr', header: 'Opción', alignLeft: true },
    { columnDef: 'startDateStr', header: 'Fecha de Inicio', alignLeft: true },
    {
      columnDef: 'endDateStr',
      header: 'Fecha de Finalización',
      alignLeft: true,
    },
  ];

  constructor(
    private _formBuilder: QuestionControlService,
    private _periodService: PeriodService,
    public alertService: AlertService
  ) {
    super(alertService);
    this.buildForm();

    this.data = [
      {
        modulo: '1',
        moduloStr: 'Planeación',
        submodulo: '1',
        submoduloStr: 'Planeación a Corto Plazo',
        opcion: '1',
        opcionStr: 'Formulación',
        startDate: moment('01/01/2024', 'DD/MM/YYYY').toDate(),
        startDateStr: '01/01/2024',
        endDate: moment('31/01/2024', 'DD/MM/YYYY').toDate(),
        endDateStr: '31/01/2024',
      },
      {
        modulo: '1',
        moduloStr: 'Planeación',
        submodulo: '2',
        submoduloStr: 'Planeación de Mediano Plazo',
        opcion: '5',
        opcionStr: 'Registro',
        startDate: moment('20/11/2023', 'DD/MM/YYYY').toDate(),
        startDateStr: '20/11/2023',
        endDate: moment('30/11/2023', 'DD/MM/YYYY').toDate(),
        endDateStr: '30/11/2023',
      },
    ];
  }

  async buildForm(): Promise<void> {
    this.questions = [
      new DropdownQuestion({
        filter: true,
        nane: 'modulo',
        label: 'Módulo',
        options: [
          {
            id: '1',
            value: 'Planeación',
          },
          {
            id: '2',
            value: 'Seguimiento',
          },
          {
            id: '3',
            value: 'Evaluación y Mejora Continua',
          },
          {
            id: '4',
            value: 'Reportes y Numeralia',
          },
        ],
        validators: [Validators.required],
      }),
    ];

    const submodules = await this._periodService.getAllSubmodules();
    this.questions.push(
      new DropdownQuestion({
        filter: true,
        disabled: true,
        nane: 'submodulo',
        label: 'Submódulo',
        options: submodules,
        validators: [Validators.required],
      })
    );

    const options = await this._periodService.getAllOptions();
    this.questions.push(
      new DropdownQuestion({
        filter: true,
        nane: 'opcion',
        disabled: true,
        label: 'Opción',
        options: options,
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DateQuestion({
        nane: 'startDate',
        label: 'Fecha de Inicio',
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DateQuestion({
        nane: 'endDate',
        label: 'Fecha de Finalización',
        validators: [Validators.required],
      })
    );

    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.get('modulo')?.valueChanges.subscribe(async (value) => {
      this.form.get('submodulo')?.enable();
      this.form.get('opcion')?.disable();
      const submodules = await this._periodService.getAllSubmodules(value);
      this.questions[1].options = submodules;
    });
    this.form.get('submodulo')?.valueChanges.subscribe(async (value) => {
      this.form.get('opcion')?.enable();
      const options = await this._periodService.getAllOptions(value);
      this.questions[2].options = options;
    });
  }

  readyToDates(): boolean {
    return (
      this.form.get('modulo')?.value &&
      this.form.get('submodulo')?.value &&
      this.form.get('opcion')?.value
    );
  }
}
