import { Component, EventEmitter, Output } from '@angular/core';
import { TableColumn } from '@common/models/tableColumn';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TabsControlService } from '../services/tabs-control.service';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { EstatusProgramaticoService } from '@common/services/seguimiento/avances/estatus.programatico.service';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { getCveActividad } from '@common/utils/Utils';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent {
  @Output() navigate: EventEmitter<number> = new EventEmitter<number>();
  data: any[] = []; //TODO ActivityResumeI
  columns: TableColumn[] = [
    { columnDef: 'actividad', header: 'Actividad', alignLeft: true },
    {
      columnDef: 'presupuesto',
      header: 'Presupuesto<br />Programado',
      width: '110px',
      isCurrency: true,
    },
    {
      columnDef: 'presupuestoModificado',
      header: 'Presupuesto<br />Modificado',
      width: '110px',
      isCurrency: true,
    },
    {
      columnDef: 'porcentajeDePresupuesto',
      header: '% de<br />Presupuesto',
      width: '100px',
    },
    {
      columnDef: 'totalDeProductos',
      header: 'Total de<br />Productos',
      width: '100px',
    },
    {
      columnDef: 'totalDeEntregables',
      header: 'Total de<br />Entregables',
      width: '100px',
    },
    {
      columnDef: 'porcentajeDeProductos',
      header: '% de Productos<br />Alcanzados',
      width: '130px',
    },
    {
      columnDef: 'porcentajeDeEntregables',
      header: '% de Entregables<br />Alcanzados',
      width: '140px',
    },
    {
      columnDef: 'numeroDeAdecuaciones',
      header: 'Número de<br />Adecuaciones',
      width: '100px',
    },
  ];
  actions: TableActionsI = {
    view: true,
  };
  loading = true;
  activeProyect: any;
  activeProyectName: string = '';
  activeActivity: number = 0;
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  currentQuarter = 2;

  constructor(
    private _formBuilder: QuestionControlService,
    private _tabsControlService: TabsControlService,
    private _estatusProgramatico: EstatusProgramaticoService
  ) {
    this.buildForm();
    this._tabsControlService.updateProgect.subscribe((value: number) => {
      this.form.get('project')?.setValue(value);
      this.activeProyect = value;
    });
    this.activeProyect = this._tabsControlService.project;
    this.getAll();
    this.activeActivity = this._tabsControlService.activity;
  }

  buildForm() {
    const questions: QuestionBase<any>[] = [];
    questions.push(
      new TextboxQuestion({
        nane: 'project',
        label: 'Clave y Nombre del Proyecto',
        disabled: true,
        value: this._tabsControlService.projectName,
      })
    );
    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(questions);
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this._estatusProgramatico
      .consultarActividadesByIdProyecto(this.activeProyect, this.currentQuarter)
      .subscribe((response) => {
        this.data = this.mapTableActivity(response.respuesta);
      });
    this.loading = false;
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        let activity = event.value;
        this.activeActivity = activity.activityId;
        this._tabsControlService.activity = this.activeActivity;
        this._tabsControlService.activityName = activity.actividad;
        break;
    }
  }

  private mapTableActivity(activities) {
    return activities.map((activity) => {
      return {
        activityId: activity.idActividad,
        actividad:
          getCveActividad({
            numeroActividad: activity.cveActividad,
            cveProyecto: parseInt(
              this._tabsControlService.projectName.slice(3, 5)
            ),
            cveUnidad: activity.cveUnidad,
          }) +
          ' ' +
          activity.nombreActividad,
        presupuesto: activity.presupuestoProgramado,
        presupuestoModificado: activity.presupuestoUtilizado,
        porcentajeDePresupuesto: activity.porcentajePresupuesto,
        totalDeProductos: activity.totalProductosProgramados,
        totalDeEntregables: activity.totalEntregablesProgramados,
        porcentajeDeProductos: activity.porcentajeProductos,
        porcentajeDeEntregables: activity.porcentajeEntregables,
        numeroDeAdecuaciones: activity.totalAdecuaciones,
      };
    });
  }
}
