import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumn } from '@common/models/tableColumn';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TabsControlService } from '../services/tabs-control.service';
import { ActivityResumeI } from './interfaces/activity-resume.interface';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { AvancesService } from '@common/services/seguimiento/avances/avances.service';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { IProjectsAnhioStatus } from '../../registro/proyects/proyects.component';
import * as moment from 'moment';
import { getCveActividad, getGlobalStatus } from '@common/utils/Utils';
import { ValidadorService } from '@common/services/validador.service';
import SecureLS from 'secure-ls';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent {
  @Output() navigate: EventEmitter<number> = new EventEmitter<number>();
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  data: ActivityResumeI[] = [];
  columns: TableColumn[] = [
    { columnDef: 'actividad', header: 'Actividad', alignLeft: true },
    { columnDef: 'estatus', header: 'Estatus', width: '140px' },
    { columnDef: 'observaciones', header: 'Observaciones', width: '180px' },
  ];
  @Input() currentQuarter: number = 2;
  actions: TableActionsI = {
    custom: [
      {
        id: 'view',
        icon: 'visibility',
        name: 'Ver Productos',
      },
    ],
  };
  loading = true;
  activeProyect;
  activeProyectId: number = 0;
  activeActivity: number = 0;
  selectedProject!: IProjectsAnhioStatus;
  ls = new SecureLS({ encodingType: 'aes' });
  dataUser = this.ls.get('dUaStEaR');

  constructor(
    private _formBuilder: QuestionControlService,
    private _tabsControlService: TabsControlService,
    private avancesService: AvancesService,
    private validadorService: ValidadorService
  ) {
    this.getAll();
    this.buildForm();
  }

  buildForm() {
    const questions: QuestionBase<any>[] = [];
    questions.push(
      new TextboxQuestion({
        nane: 'project',
        label: 'Clave y Nombre del Proyecto',
        value: this._tabsControlService.projectNombreCve,
        readonly: true,
      })
    );
    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(questions);
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this.activeProyect = this._tabsControlService.projectNombreCve;
    this.activeProyectId = this._tabsControlService.project;
    this.submit();
    this.loading = false;
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.activeActivity = event.value.activityId;
        this._tabsControlService.activity = this.activeActivity;
        this._tabsControlService.activityNombreCve = event.value.actividad;
        break;
    }
  }

  submit() {
    this.consultarActividadesByIdProyect();
  }

  async mapDataTableActivityByIdProyect(activities) {
    let data: any[] = [];
    await activities.map((activity) => {
      let tmpData = {
        activityId: activity.idActividad,
        actividad:
          getCveActividad({
            numeroActividad: activity.cveActividad,
            cveProyecto: activity.cveProyecto,
            cveUnidad: this._tabsControlService.projectNombreCve.slice(2, 3),
          }) +
          ' ' +
          activity.cxNombreActividad,
        estatus: getGlobalStatus(activity.estatusRevision),
        observaciones: activity.observaciones
          ? 'Con Observaciones'
          : 'Sin Observaciones',
      };
      data.push(tmpData);
    });
    this.data = data;
  }

  consultarActividadesByIdProyect() {
    this.avancesService
      .consultarActividades(
        this.activeProyectId.toString(),
        this.currentQuarter
      )
      .subscribe((response) => {
        this.mapDataTableActivityByIdProyect(response.respuesta);
      });
  }
}
