import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { TabsControlService } from '../services/tabs-control.service';
import { EstatusProgramaticoService } from '@common/services/seguimiento/avances/estatus.programatico.service';
import { Subject, forkJoin, lastValueFrom, takeUntil } from 'rxjs';
import { AvancesService } from '@common/services/seguimiento/avances/avances.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import * as SecureLS from 'secure-ls';
import { getCveActividad, getCveProyecto } from '@common/utils/Utils';
import { OptionI } from '@common/form/interfaces/option.interface';
import { environment } from 'src/environments/environment';
import { CatalogsService } from '@common/services/catalogs.service';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { AlfrescoService } from '@common/services/alfresco.service';
import { AlertService } from '@common/services/alert.service';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { ExcelJsService } from '@common/services/exceljs.service';
import { ProjectsService } from '@common/services/projects.service';
import {
  getFormatDataForGeneralView,
  getFormatDataFromGeneralDataForExcel,
} from '@common/utils/Utils';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.scss'],
})
export class ProyectsComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  @Output() navigate: EventEmitter<number> = new EventEmitter<number>();
  form!: FormGroup;
  currentQuarter: number = 1;
  questions: QuestionBase<any>[] = [];
  dataVistaGeneral: any;

  data: any[] = []; //TODO ProjectResumeI[]
  columns: TableColumn[] = [
    { columnDef: 'unidad', header: 'Unidad', width: '100px' },
    { columnDef: 'proyecto', header: 'Proyecto PAA', alignLeft: true },
    {
      columnDef: 'presupuestoProgramado',
      header: 'Presupuesto<br />Programado',
      width: '110px',
      isCurrency: true,
    },
    {
      columnDef: 'presupuestoUtilizado',
      header: 'Presupuesto<br />Modificado',
      width: '110px',
      isCurrency: true,
    },
    {
      columnDef: 'porcentajePresupuesto',
      header: '% de<br />Presupuesto',
      width: '100px',
    },
    {
      columnDef: 'totalActividades',
      header: 'Total de<br />Actividades',
      width: '100px',
    },
    {
      columnDef: 'totalProductosProgramados',
      header: 'Total de<br />Productos',
      width: '100px',
    },
    {
      columnDef: 'totalProductosEntregados',
      header: 'Total de<br />Entregables',
      width: '100px',
    },
    {
      columnDef: 'porcentajeProductos',
      header: '% de<br />Productos',
      width: '100px',
    },
    {
      columnDef: 'porcentajeEntregables',
      header: '% de<br />Entregables',
      width: '100px',
    },
    {
      columnDef: 'totalAdecuaciones',
      header: 'Número de<br />Adecuaciones',
      width: '100px',
    },
  ];
  actions: TableActionsI = {
    view: true,
  };
  loading = true;
  activeProject: number = 0;
  dataUser: IDatosUsuario;
  yearNav: string;
  notifier = new Subject();
  showUploadFile: boolean = false;
  isSubmitingFile: boolean = false;
  dataAlf: ISeguridadAlfResponse;
  nameFileWitUrlDrive: string = 'Url del Repositorio.txt';
  urlToDrive: string = '';

  constructor(
    private _formBuilder: QuestionControlService,
    private _tabsControlService: TabsControlService,
    private _estatusProgramatico: EstatusProgramaticoService,
    private _avancesService: AvancesService,
    private catalogService: CatalogsService,
    private alfrescoService: AlfrescoService,
    private alertService: AlertService,
    private excelJsService: ExcelJsService,
    private projectsService: ProjectsService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.dataAlf = this.ls.get('dataAlf');
    this.getCatalogs();
    this.getCurrentQuarter();
    this.buildForm();
    this.getAll();
    this.getFilesFromAlfSeguimiento();
    this.submit();
  }

  buildForm() {
    const questions: QuestionBase<any>[] = [];
    questions.push(
      new DropdownQuestion({
        nane: 'idUnidad',
        label: 'Unidad',
        filter: true,
        options: [],
      })
    );
    questions.push(
      new DropdownQuestion({
        nane: 'idProyecto',
        label: 'Clave y nombre del Proyecto',
        filter: true,
        options: [],
      })
    );
    questions.push(
      new DropdownQuestion({
        nane: 'idActividad',
        label: 'Clave y nombre de la Actividad',
        filter: true,
        options: [],
      })
    );
    questions.push(
      new DropdownQuestion({
        nane: 'tipoAdecuacion',
        label: 'Tipo de Adecuación',
        filter: true,
        options: [],
      })
    );
    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(questions);
    this.form
      .get('idProyecto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.form.get('idActividad')?.setValue('');
          this.getActivityByProjectId(value);
        }
      });
    this.form
      .get('idActividad')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.form.get('tipoAdecuacion')?.setValue('');
        }
      });
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['unidadAdministrativa']
      ),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(([dataClaveNombreUnidadResponsable]) => {
        const unidades = this.questions.find((i) => i.nane === 'idUnidad');
        if (unidades) {
          unidades.options = mapCatalogData({
            data: dataClaveNombreUnidadResponsable,
          });
        }
      });
  }

  async getProjectsPAA(): Promise<void> {
    this.data = [];
    const value = await lastValueFrom(
      this._avancesService.consultarProyectos(
        this.dataUser.cveUsuario,
        Number(this.yearNav)
      )
    );
    const data: OptionI[] = value.respuesta.map((item) => {
      return {
        id: item.idProyecto,
        value: `${getCveProyecto({
          cveProyecto: +item.cveProyecto,
          cveUnidad: item.cveUnidad,
          yearNav: item.idAnhio?.toString(),
        })}. ${item.nombreProyecto}`,
      };
    });
    const question = this.questions.find((q) => q.nane === 'idProyecto');
    if (question) {
      question.options = data;
    }
  }

  getFilesFromAlfSeguimiento() {
    const urlDrive = this.ls.get('urlDrive');
    if (urlDrive) {
      this.urlToDrive = urlDrive;
    } else {
      this.alfrescoService
        .getFilesAlfService({
          skipCount: '0',
          maxItems: '100000',
          uidContenedor: this.dataAlf.uuidSeguimiento,
        })
        .subscribe({
          next: (value) => {
            if (value.list?.entries?.length) {
              const fileWithUrlToAlf = value.list.entries.find(
                (item: any) => item.entry.name === this.nameFileWitUrlDrive
              );
              if (fileWithUrlToAlf) {
                this.getFileWithUrlDrive(fileWithUrlToAlf.entry.id);
              }
            }
          },
        });
    }
  }

  getFileWithUrlDrive(uidTxt: string) {
    this.alfrescoService
      .viewOrDownloadFileAlfService({
        action: 'viewer',
        uid: uidTxt,
        fileName: this.nameFileWitUrlDrive,
        withB64: true,
      })
      .then((response) => {
        const b64Clean = response.b64?.split('base64,')[1];
        this.urlToDrive = atob(`${b64Clean}`);
        this.ls.set('urlDrive', this.urlToDrive);
        this.isSubmitingFile = false;
        this.showUploadFile = false;
      });
  }

  getExcelByProyectId() {
    let project = this.data.find((proyect) => {
      return proyect.idProyecto == this.activeProject;
    });
    this.getVistaGeneral(project.idProyecto, '2024');
  }

  getVistaGeneral(idProject: number, yearNav?: string) {
    this.projectsService
      .getVistaGeneralByIdProject(
        yearNav ?? this.yearNav,
        this.dataUser.cveUsuario,
        idProject
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200' && value.proyecto?.length) {
            this.dataVistaGeneral = getFormatDataForGeneralView({
              proyectoService: value.proyecto[0],
              selectedProject: this.activeProject,
              catAlcance: [],
              catCategoria: [],
              catTipoProducto: [],
            });
            const tmpProgramas: any[] = getFormatDataFromGeneralDataForExcel(
              this.dataVistaGeneral
            );
            this.excelJsService.createExcelReporteProyectoAnual({
              dataVistaGeneral: this.dataVistaGeneral,
              data: tmpProgramas,
            });
          }
        },
        error: (err) => { },
      });
  }

  getCurrentQuarter() {
    const today = new Date();
    const month = today.getMonth();
    if (month < 3) {
      this.currentQuarter = 1;
    } else if (month < 6) {
      this.currentQuarter = 2;
    } else if (month < 9) {
      this.currentQuarter = 3;
    } else {
      this.currentQuarter = 4;
    }
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this.data = [];
    this.loading = false;
  }

  async onTableAction(event: TableButtonAction) {
    if (event.name === TableConsts.actionButton.view) {
      let proyect = event.value;
      this.activeProject = proyect.idProyecto;
      this._tabsControlService.project = this.activeProject;
      this._tabsControlService.projectName =
        getCveProyecto({
          cveProyecto: proyect.claveProyecto,
          cveUnidad: proyect.cveUnidad,
        }) +
        ' ' +
        proyect.proyecto;
    }
  }

  async submit(): Promise<void> {
    const result = await lastValueFrom(
      this._estatusProgramatico.consultarProyectosEPP({
        ...this.form.value,
        trimestre: this.currentQuarter == 5 ? null : this.currentQuarter,
        anhio: this.yearNav,
      })
    );
    this.data = result.respuesta;
    const data: OptionI[] = this.data.map((item) => {
      return {
        id: item.idProyecto,
        value: `${getCveProyecto({
          cveProyecto: item.claveProyecto,
          cveUnidad: item.cveUnidad,
          yearNav: item.idAnhio?.toString(),
        })}. ${item.proyecto}`,
      };
    });
    const question = this.questions.find((q) => q.nane === 'idProyecto');
    if (question) {
      question.options = data;
    }
    this.activeProject = this._tabsControlService.project;
  }

  editUrl() {
    this.showUploadFile = true;
  }

  cancelEditUrl() {
    this.showUploadFile = false;
  }

  onOutputFile(files: any) {
    const file: File = files[0];
    if (file.name.includes('.txt')) {
      this.isSubmitingFile = true;
      this.alfrescoService
        .uploadFileToAlfrescoPromise(this.dataAlf.uuidSeguimiento, file, true)
        .then((response) => {
          this.getFileWithUrlDrive(response);
          this.alertService.showAlert('Se Actualizó Correctamente');
        })
        .catch((error) => {
          this.isSubmitingFile = false;
          this.alertService.showAlert(
            'Error al Actualizar, Intente más Tarde.'
          );
        });
    }
  }

  btnHelp() {
    this.alertService.showAlert(
      `Solo se puede cargar 1 archivo. Url del Repositorio:  "${this.nameFileWitUrlDrive}" y en formato txt.`
    );
  }

  redirectToSIF() {
    window.open(this.urlToDrive, '_blank');
  }

  private getActivityByProjectId(idProyecto) {
    this._avancesService.consultarActividades(idProyecto).subscribe((value) => {
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
}
