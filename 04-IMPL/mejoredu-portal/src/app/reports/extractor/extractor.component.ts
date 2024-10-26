import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { NumberQuestion } from '@common/form/classes/question-number.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { IExtractorPayload } from '@common/interfaces/reportes/extractores.interface';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';
import { ExtractoresService } from '@common/services/reportes/extractores.service';
import { TblWidthService } from '@common/services/tbl-width.service';
import * as moment from 'moment';
import { GenerateXLSXService } from '@common/report-builder/services/generate-xlsx.service';

@Component({
  selector: 'app-extractor',
  templateUrl: './extractor.component.html',
  styleUrls: ['./extractor.component.scss'],
})
export class ExtractorComponent {
  @ViewChild('tbl') tbl!: ElementRef;
  ls = new SecureLS({ encodingType: 'aes' });
  data: any[] = [];
  columns: TableColumn[] = [
    {
      columnDef: 'ANHIO',
      header: 'Año',
    },
    {
      columnDef: 'AREA_ADMINISTRATIVA',
      header: 'Área Administrativa',
    },
    {
      columnDef: 'CLAVE_PROYECTO',
      header: 'Clave de Proyecto',
    },
    {
      columnDef: 'NOMBRE_PROYECTO',
      header: 'Nombre de Proyectos',
    },
    {
      columnDef: 'CLAVE_ACTIVIDAD',
      header: 'Clave de Actividad',
    },
    {
      columnDef: 'NOMBRE_PROYECTO',
      header: 'Nombre de Actividades',
    },
    {
      columnDef: 'CLAVE_PRODUCTO',
      header: 'Clave Productos',
    },
    {
      columnDef: 'NOMBRE_PROYECTO',
      header: 'Productos',
    },
    {
      columnDef: 'CATEGORIA',
      header: 'Categoría',
    },
    {
      columnDef: 'TIPO',
      header: 'Tipo',
    },
    {
      columnDef: 'MES',
      header: 'Mes',
    },
    {
      columnDef: 'ENTREGABLE',
      header: 'Entregable',
    },
  ];
  loading = true;
  ready: boolean = false;

  notifier = new Subject();
  formUnchanged = true;
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  variables: { id: string; value: string }[] = [];
  dataUser: IDatosUsuario;
  yearNav: string;
  isSubmiting: boolean = false;
  allVariables: { id: string; value: string }[] = [
    {
      id: 'ALL',
      value: 'Agregar todas',
    },
    {
      id: 'ANHIO',
      value: 'Año',
    },
    {
      id: 'AREA_ADMINISTRATIVA',
      value: 'Área Administrativa',
    },
    {
      id: 'CLAVE_PROYECTO',
      value: 'Clave de Proyecto',
    },
    {
      id: 'NOMBRE_PROYECTO',
      value: 'Nombre de Proyectos',
    },
    {
      id: 'CLAVE_ACTIVIDAD',
      value: 'Clave de Actividad',
    },
    {
      id: 'NOMBRE_ACTIVIDAD',
      value: 'Nombre de Actividades',
    },
    {
      id: 'CLAVE_PRODUCTO',
      value: 'Clave Productos',
    },
    {
      id: 'NOMBRE_PRODUCTO',
      value: 'Productos',
    },
    {
      id: 'CATEGORIA',
      value: 'Categoría',
    },
    {
      id: 'TIPO',
      value: 'Tipo',
    },
    {
      id: 'MES',
      value: 'Mes',
    },
    {
      id: 'ENTREGABLE',
      value: 'Entregable',
    },
  ];

  selectedAll: boolean = false;

  constructor(
    private _formBuilder: QuestionControlService,
    private _alertService: AlertService,
    private _tblWidthService: TblWidthService,
    private extractoresService: ExtractoresService,
    private generateXLSXService: GenerateXLSXService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    const questions: any = [];

    questions.push(
      new DropdownQuestion({
        nane: 'baseDatos',
        value: 'PAA_Aprobado',
        label: 'Base de Datos',
        filter: true,
        options: [
          {
            id: 'PAA_Aprobado',
            value: 'PAA_Aprobado',
          },
          // {
          //   id: 'Adecuaciones_Programáticas',
          //   value: 'Adecuaciones_Programáticas',
          // },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'variables',
        label: 'Variables',
        filter: true,
        multiple: true,
        options: this.allVariables,
        validators: [Validators.required],
      })
    );

    questions.push(
      new NumberQuestion({
        nane: 'anho',
        label: 'Año',
        value: this.yearNav,
        validators: [Validators.required],
      })
    );

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.valueChanges.pipe(takeUntil(this.notifier)).subscribe(() => {
      this.formUnchanged = false;
    });
  }

  ngOnInit() {
    this.form.get('variables')?.valueChanges.subscribe((value) => {
      if (value) {
        const containAll = value.includes('ALL');
        if (this.selectedAll && !containAll) {
          this.selectedAll = false;
          this.form.get('variables')?.setValue([], { emitEvent: false });
        } else if (!this.selectedAll && containAll) {
          this.selectedAll = true;
          const tmpArrayVar: string[] = this.allVariables.map(
            (item) => item.id
          );
          this.form
            .get('variables')
            ?.setValue(tmpArrayVar, { emitEvent: false });
        } else if (
          this.selectedAll &&
          containAll &&
          value.length < this.allVariables.length
        ) {
          this.selectedAll = false;
          value.shift();
          this.form.get('variables')?.setValue(value, { emitEvent: false });
        } else if (
          !this.selectedAll &&
          !containAll &&
          value.length === this.allVariables.length - 1
        ) {
          this.selectedAll = true;
          this.form.get('variables')?.setValue(
            this.allVariables.map((item) => item.id),
            { emitEvent: false }
          );
        }
      }
    });
  }

  getColWidth(widthLess: number, percent: number): number {
    return this._tblWidthService.getColWidth(widthLess, percent);
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return this.formUnchanged;
  }

  resetVars(): void {
    this.form.get('variables')?.setValue([]);
    this.data = [];
    this.variables = [];
    this.ready = false;
  }

  canUpVariable(i: number): boolean {
    if (i === 1 && this.selectedAll) {
      return false;
    }
    return i > 0;
  }

  canDownVariable(i: number): boolean {
    return i < this.variables.length - 1;
  }

  upVariable(i: number): void {
    const temp = this.variables[i - 1];
    this.variables[i - 1] = this.variables[i];
    this.variables[i] = temp;
  }

  downVariable(i: number): void {
    const temp = this.variables[i + 1];
    this.variables[i + 1] = this.variables[i];
    this.variables[i] = temp;
  }

  deleteVariable(i: number): void {
    this.variables.splice(i, 1);
  }

  getHeaders(): string[] {
    return this.columns.map((c) => c.header);
  }

  generatePreview(): void {
    this.ready = false;
    this.isSubmiting = true;
    this.generateColumns();
    this.ready = true;
  }

  consultaPaaAprobado() {
    this.data = [];
    const { anho, variables } = this.form.getRawValue();
    const dataExtractor: IExtractorPayload = {
      cveUsuario: this.dataUser.cveUsuario,
      idAnhio: anho,
      dataReporte: variables,
    };
    this.extractoresService
      .consultaPaaAprobado(dataExtractor)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.isSubmiting = false;
          if (value.codigo === '200') {
            if (value.respuesta.length) {
              const tmpVariables: string[] = this.form.get('variables')?.value;
              this.variables = tmpVariables.map((item) => {
                const finded = this.allVariables.filter(
                  (itemFilter) => itemFilter.id === item
                );
                return finded[0];
              });

              this.data = value.respuesta.map((item) => {
                return {
                  ANHIO: item.idAnhio,
                  // ORIGEN: 'Proyecto PAA',
                  AREA_ADMINISTRATIVA: item.cxOrigen,
                  CLAVE_PROYECTO: item.cveProyecto,
                  NOMBRE_PROYECTO: item.nombreProyecto,
                  CLAVE_ACTIVIDAD: item.cveActividad,
                  NOMBRE_ACTIVIDAD: item.nombreActividad,
                  CLAVE_PRODUCTO: item.cveProducto,
                  NOMBRE_PRODUCTO: item.nombreProducto,
                  CATEGORIA: item.nombreCategoria,
                  TIPO: item.nombreTipo,
                  MES: item.mes,
                  ENTREGABLE: item.entregable,
                };
              });
            } else {
              this._alertService.showAlert(
                'No se Encontró Información con los Filtros Seleccionados'
              );
            }
          }
        },
        error: (err) => { },
      });
  }

  generateColumns(): void {
    const columns: TableColumn[] = [];
    for (const item of this.variables) {
      if (item.id !== 'ALL') {
        columns.push({
          columnDef: item.id,
          header: item.value,
        })
      }
    }
    this.columns = columns;
  }

  drop(event: any) {
    moveItemInArray(this.variables, event.previousIndex, event.currentIndex);
  }

  submit() {
    if (!this.form.valid) {
      return;
    }
    this.variables = [];
    this.consultaPaaAprobado();
    this.ready = false;
  }

  downloadData() {
    this.generateXLSXService.exportExcel(
      `ExtractorDeDatos-${moment().format('DD-MM-YYYY HH:mm:ss')}`,
      [
        {
          name: 'Datos',
          item: this.tbl,
        },
      ]
    );
  }

  ngOnDestroy(): void {
    this.notifier.complete();
  }
}
