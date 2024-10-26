import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { CatalogsService } from '@common/services/catalogs.service';
import { AvancesService } from '@common/services/seguimiento/avances/avances.service';
import {
  getCveActividad,
  getCveProyecto,
  getGlobalStatus,
} from '@common/utils/Utils';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { environment } from 'src/environments/environment';
import { TabsControlService } from '../services/tabs-control.service';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.scss'],
})
export class ProyectsComponent {
  @Output() navigate: EventEmitter<number> = new EventEmitter<number>();
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  @Input() currentQuarter!: number;

  data: any[] = [];
  columns: TableColumn[] = [
    { columnDef: 'unidad', header: 'Unidad', width: '100px' },
    { columnDef: 'proyectoPAA', header: 'Proyecto PAA', alignLeft: true },
    {
      columnDef: 'estatus',
      header: 'Estatus',
      alignRight: true,
      width: '240px',
    },
    { columnDef: 'observaciones', header: 'Observaciones', width: '180px' },
  ];
  actions: TableActionsI = {
    custom: [
      {
        id: 'view',
        icon: 'visibility',
        name: 'Ver Actividades',
      },
    ],
  };
  loading = true;
  activeProject: number = 0;
  notifier = new Subject();
  ls = new SecureLS({ encodingType: 'aes' });
  idAnhio = this.ls.get('yearNav');

  constructor(
    private _formBuilder: QuestionControlService,
    private _tabsControlService: TabsControlService,
    private catalogService: CatalogsService,
    private avancesService: AvancesService
  ) {
    this.buildForm();
    this.getAll();
    this.getCatalogs();
  }

  buildForm() {
    const questions: QuestionBase<any>[] = [];
    questions.push(
      new DropdownQuestion({
        nane: 'unidad',
        label: 'Unidad',
        filter: true,
        options: [],
      })
    );
    questions.push(
      new DropdownQuestion({
        nane: 'Proyecto',
        label: 'Clave y Nombre del Proyecto',
        filter: true,
        options: [],
      })
    );
    questions.push(
      new DropdownQuestion({
        nane: 'Actividad',
        label: 'Clave y Nombre de la Actividad',
        filter: true,
        options: [],
      })
    );
    questions.push(
      new DropdownQuestion({
        nane: 'Producto',
        label: 'Clave y Nombre del Producto',
        filter: true,
        options: [],
      })
    );
    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(questions);
    this.form
      .get('unidad')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.form.get('Proyecto')?.setValue('');
          this.getProyectByIdUnidad(value);
        }
      });
    this.form
      .get('Proyecto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.form.get('Actividad')?.setValue('');
          this.getActivityByProjectId(value);
        }
      });
    this.form
      .get('Actividad')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.form.get('Producto')?.setValue('');
          this.getProductByActivitytId(value);
        }
      });
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this.data = [];
    this.submit();
    this.loading = false;
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.activeProject = event.value.projectId;
        this._tabsControlService.project = this.activeProject;
        this._tabsControlService.projectNombreCve = event.value.proyectoPAA;
        break;
    }
  }

  submit() {
    let ls = new SecureLS({ encodingType: 'aes' });
    let idAnhio = ls.get('yearNav');
    let dataUser = ls.get('dUaStEaR');
    this.avancesService
      .consultarPAA(dataUser.cveUsuario, idAnhio, this.currentQuarter)
      .subscribe((response) => {
        this.data = this.mapDataTableProyectsByIdUnidad(response.respuesta);
      });
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['unidadAdministrativa']
      ),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(([dataClave]) => {
        // COMMENT: unidad
        this.questions[0].options = mapCatalogData({
          data: dataClave,
        });
      });
  }

  private getProyectByIdUnidad(idUnidad: number) {
    let ls = new SecureLS({ encodingType: 'aes' });
    let idAnhio = ls.get('yearNav');
    this.avancesService
      .consultarPaaIdUnidad(idUnidad, idAnhio)
      .subscribe((value) => {
        this.questions[1].options = this.mapOptionProjects(value.respuesta);
        this.data = this.mapDataTableProyectsByIdUnidad(value.respuesta);
      });
  }

  private getActivityByProjectId(idProyecto) {
    this.avancesService.consultarActividades(idProyecto).subscribe((value) => {
      this.questions[2].options = value.respuesta.map((item) => {
        return {
          id: item.idActividad,
          value:
            getCveActividad({
              numeroActividad: item.cveActividad,
              cveProyecto: item.cveProyecto,
              cveUnidad: item.cveUnidad,
            }) +
            ' ' +
            item.cxNombreActividad,
        };
      });
    });
  }

  private getProductByActivitytId(idActividad) {
    this.avancesService
      .consultarProductos(idActividad, 1)
      .subscribe((value) => {
        this.questions[3].options = value.respuesta.map((item) => {
          return {
            id: item.idActividad,
            value: item.cxNombre,
          };
        });
      });
  }

  private mapDataTableProyectsByIdUnidad(proyects) {
    let data: any = [];
    proyects.map((proyect) => {
      if (proyect.estatusRevision) {
        let mappedProyect = {
          projectId: proyect.idProyecto,
          unidad: proyect.cveUnidad,
          proyectoPAA:
            getCveProyecto({
              yearNav: this.idAnhio,
              cveUnidad: proyect.cveUnidad,
              cveProyecto: proyect.cveProyecto,
            }) +
            ' ' +
            proyect.nombreProyecto,
          estatus: getGlobalStatus(proyect.estatusRevision),
          observaciones: proyect.observaciones
            ? 'Con Observaciones'
            : 'Sin Observaciones',
        };
        data.push(mappedProyect);
      }
    });
    return data;
  }

  private mapOptionProjects(data) {
    return data.map((item) => {
      return {
        id: item.idProyecto,
        value:
          getCveProyecto({
            yearNav: this.idAnhio,
            cveUnidad: item.cveUnidad,
            cveProyecto: item.cveProyecto,
          }) +
          ' ' +
          item.nombreProyecto,
      };
    });
  }
}
