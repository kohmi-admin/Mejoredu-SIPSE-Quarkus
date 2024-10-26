import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { IProjectsAnhioStatus } from '../proyects/proyects.component';
import { Subject, takeUntil } from 'rxjs';
import { AvancesService } from '@common/services/seguimiento/avances/avances.service';
import { getNumeroActividad } from '@common/utils/Utils';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent {
  @Output() navigate: EventEmitter<number> = new EventEmitter<number>();
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  data: any[] = [];
  columns: TableColumn[] = [
    { columnDef: 'actividad', header: 'Actividad', alignLeft: true },
  ];
  @Input() currentQuarter: number = 1;
  actions: TableActionsI = {
    custom: [
      {
        id: 'view',
        icon: 'visibility',
        name: 'Ver Productos',
      },
    ],
  };
  loading = false;
  activeActivity: number = 0;
  selectedProject!: IProjectsAnhioStatus;
  notifier = new Subject();

  constructor(
    private _formBuilder: QuestionControlService,
    private _tabsControlService: TabsControlService,
    private _avancesService: AvancesService
  ) {
    this._tabsControlService.updateProgectName.subscribe((value: string) => {
      this.form.controls['project'].setValue(value);
    });
    this._tabsControlService.updateProgect.subscribe((value) => {
      this.selectedProject = value;
      this.getActivitiesByIdProject(this.selectedProject.idProyecto);
    });
    this.buildForm();
  }

  buildForm() {
    const questions: QuestionBase<any>[] = [];
    questions.push(
      new TextboxQuestion({
        nane: 'project',
        label: 'Clave y Nombre del Proyecto',
        readonly: true,
      })
    );
    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(questions);
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this.data = [
      {
        activityId: 1,
        actividad:
          '001 Desarrollar acciones de coordinación y seguimiento del Sistema Nacional de Mejora Continua de la Educación',
      },
      {
        activityId: 2,
        actividad: '002 Gestionar las políticas y procesos de MEJOREDU',
      },
      {
        activityId: 3,
        actividad:
          '003 Desarrollar la Estrategia de comunicación institucional',
      },
    ];
    this.loading = false;
  }

  getActivitiesByIdProject(idProyecto: any) {
    this.data = [];
    this._avancesService
      .consultarActividades(idProyecto)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length) {
            this.data = value.respuesta.map((item) => {
              return {
                ...item,
                actividad: `${getNumeroActividad(item.cveActividad)} ${item.cxNombreActividad
                  }`,
              };
            });
          }
        },
      });
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.activeActivity = event.value.idActividad;
        this._tabsControlService.activity = event.value;
        this._tabsControlService.activityName = event.value.actividad;
        break;
    }
  }

  ngOnDestroy() {
    this.notifier.complete();
  }
}
