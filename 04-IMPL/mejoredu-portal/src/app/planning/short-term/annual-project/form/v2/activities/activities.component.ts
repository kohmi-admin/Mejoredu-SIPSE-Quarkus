import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { Observable, Subject, forkJoin, take, takeUntil } from 'rxjs';
import { FormsStateService } from '../../services/forms-state.service.ts.service';
import { AlertService } from '@common/services/alert.service';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TblWidthService } from '@common/services/tbl-width.service';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { CheckboxQuestion } from '@common/form/classes/question-checkbox.class';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import {
  ICatalogResponse,
  IItemCatalogoResponse,
} from '@common/interfaces/catalog.interface';
import { CatalogsService } from '@common/services/catalogs.service';
import { environment } from 'src/environments/environment';
import { ProjectsService } from '@common/services/projects.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import * as SecureLS from 'secure-ls';
import { IItemProjectsResponse } from '@common/interfaces/projects.interface';
import { mapOptionProjects } from '@common/mapper/data-options.mapper';
import { ActivitiesService } from '@common/services/activities.service';
import { TableColumn } from '@common/models/tableColumn';
import {
  IItemActivitiesResponse,
  MasterCatalogsIds,
} from '@common/interfaces/activities.interface';
import { StateViewService } from 'src/app/planning/short-term/services/state-view.service';
import {
  getCveProyecto,
  getGlobalStatus,
  getNumeroActividad,
} from '@common/utils/Utils';
import { GoalsService } from '@common/services/goals.service';
import { StrategiesService } from '@common/services/strategies.service';
import { ActionsService } from '@common/services/actions.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnDestroy {
  ls = new SecureLS({ encodingType: 'aes' });

  @Output() setRecord: EventEmitter<any> = new EventEmitter<any>();
  data: any[] = [];
  columns: TableColumn[] = [
    {
      columnDef: 'cveProyecto',
      header: 'Clave del<br />Proyecto',
      width: '200px',
    },
    {
      columnDef: 'cveActividad',
      header: 'Clave de la<br />Actividad',
      width: '200px',
    },
    {
      columnDef: 'cxNombreActividad',
      header: 'Nombre de la Actividad',
      alignLeft: true,
    },
    { columnDef: 'csEstatus', header: 'Estatus', width: '110px' },
  ];
  actions: TableActionsI = {
    edit: true,
    delete: true,
    view: true,
  };
  customBtn: string = '';

  loading = true;

  notifier = new Subject();
  formUnchanged = true;
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  private _body = document.querySelector('body');

  dataPP: any[] = [];
  dataUser: IDatosUsuario;
  yearNav: string = '';

  dataProjects: IItemProjectsResponse[] = [];
  selectedValue: any;
  isSubmiting: boolean = false;
  claveActividad: number = 0;

  isUpdate: boolean = false;
  disabledSubmiting: boolean = false;

  objetivosPrioritariosMapper: any = [];
  isCleanForm: boolean = false;

  //catalogs
  dataObjetivosPrioritario: ICatalogResponse[] | any = [];
  dataEstrategiaPrioritaria: ICatalogResponse[] | any = [];
  dataAccionPuntualPI: ICatalogResponse[] | any = [];
  dataAlcance: ICatalogResponse[] | any = [];
  validation = false;
  editable = true;
  dataSelected: IItemActivitiesResponse | null = null;
  idSaveValidar: number = 0;
  selectedAjustesProyectoPAA: {
    name: string;
    value: IItemProjectsResponse;
  } | null = null;
  selectedConsultaProyectoPAA: {
    name: string;
    value: IItemProjectsResponse;
  } | null = null;
  selectedValidateProyectoPAA: any = null;
  disabledAppValidate: boolean = false;

  objetivosPrioritariosFilter: IItemCatalogoResponse[] = [];
  estrategiaPrioritariaFilter: IItemCatalogoResponse[] = [];

  canEditProject: boolean = false;

  constructor(
    private _formBuilder: QuestionControlService,
    private _formsState: FormsStateService,
    private _alertService: AlertService,
    private _tblWidthService: TblWidthService,
    private catalogService: CatalogsService,
    private projectsService: ProjectsService,
    private activitiesService: ActivitiesService,
    private _stateView: StateViewService,
    private goalsService: GoalsService,
    private strategiesService: StrategiesService,
    private actionsService: ActionsService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.selectedConsultaProyectoPAA = this.ls.get(
      'selectedConsultaProyectoPAA'
    );
    this.selectedAjustesProyectoPAA = this.ls.get('selectedAjustesProyectoPAA');
    this.selectedValidateProyectoPAA = this.ls.get(
      'selectedValidateProyectoPAA'
    );

    this.createQuestions();
    this.getAll();
    this._formsState.unactiveAll();
    this._body?.classList.add('hideW');
  }

  ngOnInit() {
    this.form
      .get('nombreProyecto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.newActivity('nombreProyecto');
          this.form
            .get('nombreProyecto')
            ?.setValue(value, { emitEvent: false });
          this.questions[5].options = [];
          const projectSelected = this.dataProjects.find(
            (proyecto: IItemProjectsResponse) => proyecto.idProyecto === value
          );
          if (
            !projectSelected ||
            !projectSelected.contribucionObjetivoPrioritarioPI
          ) {
            return;
          }

          if (!this.selectedConsultaProyectoPAA) {
            if (
              projectSelected.estatus === 'T' ||
              projectSelected.estatus === 'P' ||
              projectSelected.estatus === 'E' ||
              projectSelected.estatus === 'V' ||
              projectSelected.estatus === 'O' ||
              projectSelected.estatusPlaneacion === 'R' ||
              projectSelected.estatusPresupuesto === 'R' ||
              projectSelected.estatusSupervisor === 'R'
            ) {
              this.canEditProject = false;
              this.actions.edit = false;
              this.actions.delete = false;
            } else {
              this.canEditProject = true;
              this.actions.edit = true;
              this.actions.delete = true;
            }

            if (
              projectSelected.estatus === 'C' &&
              ((projectSelected.estatusPlaneacion === 'R' &&
                projectSelected.estatusPresupuesto === 'R') ||
                (projectSelected.estatusPlaneacion === 'V' &&
                  projectSelected.estatusPresupuesto === 'R') ||
                (projectSelected.estatusPlaneacion === 'R' &&
                  projectSelected.estatusPresupuesto === 'V') ||
                (projectSelected.estatusPlaneacion === 'V' &&
                  projectSelected.estatusPresupuesto === 'V' &&
                  projectSelected.estatusSupervisor === 'R'))
            ) {
              this.canEditProject = true;
              this.actions.edit = true;
              this.actions.delete = true;
            }
            if (
              this.selectedAjustesProyectoPAA &&
              projectSelected.estatus === 'V'
            ) {
              this.canEditProject = true;
              this.actions.edit = true;
              this.actions.delete = true;
            }
          }

          const idsObjetivosPrioritariosProject =
            projectSelected?.contribucionObjetivoPrioritarioPI?.map(
              (item) => item.idCatalogo
            );

          this.objetivosPrioritariosFilter =
            this.dataObjetivosPrioritario.catalogo.filter((item) =>
              idsObjetivosPrioritariosProject?.includes(item.idCatalogo)
            );

          const getCustomNameObjeto = (item: IItemCatalogoResponse): string =>
            `${item.ccExterna}. ${item.cdOpcion}`;
          this.questions[5].options = mapCatalogData({
            data: {
              mensaje: {
                codigo: '200',
                mensaje: '',
              },
              catalogo: this.objetivosPrioritariosFilter,
            },
            withIdx: false,
            withOrder: true,
            keyForOrder: 'ccExterna',
            getCustomValue: getCustomNameObjeto,
          });
          if (!this.selectedConsultaProyectoPAA) {
            this.form.get('objetivoPrioritario')?.enable();
          }

          this.getActivities(value);

          const textboxQuestionIndexClaveProyecto = this.questions.findIndex(
            (q) => q.nane === 'claveProyecto'
          );
          const textboxQuestionIndexClaveActividad = this.questions.findIndex(
            (q) => q.nane === 'claveActividad'
          );

          if (
            textboxQuestionIndexClaveProyecto !== -1 &&
            textboxQuestionIndexClaveActividad !== -1
          ) {
            const textboxQuestionClaveProyecto = this.questions[
              textboxQuestionIndexClaveProyecto
            ] as TextboxQuestion;

            textboxQuestionClaveProyecto.value = getCveProyecto({
              cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
              cveProyecto: +projectSelected?.clave,
            });

            this.form
              .get('claveProyecto')
              ?.setValue(textboxQuestionClaveProyecto.value);
          }
        }
      });

    this.form
      .get('objetivoPrioritario')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.questions[6].options = [];
          const ccExternasObjetivos = this.objetivosPrioritariosFilter
            .filter((item) => value.includes(item.idCatalogo))
            .map((item) => {
              return item.ccExterna;
            });

          this.estrategiaPrioritariaFilter =
            this.dataEstrategiaPrioritaria.catalogo.filter((item) =>
              ccExternasObjetivos.includes(item.ccExterna)
            );

          const getCustomNameEstrategia = (
            item: IItemCatalogoResponse
          ): string => `${item.ccExternaDos}. ${item.cdOpcion}`;
          this.questions[6].options = mapCatalogData({
            data: {
              mensaje: {
                codigo: '200',
                mensaje: '',
              },
              catalogo: this.estrategiaPrioritariaFilter,
            },
            withIdx: false,
            withOrder: true,
            keyForOrder: 'ccExternaDos',
            getCustomValue: getCustomNameEstrategia,
          });
          this.form.get('estrategiaPrioritaria')?.enable();
        }
      });

    this.form
      .get('estrategiaPrioritaria')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.questions[7].options = [];
          const ccExternaDosEstratega = this.estrategiaPrioritariaFilter
            .filter((item) => value.includes(item.idCatalogo))
            .map((item) => {
              return item.ccExternaDos;
            });

          const accionPuntualFilter = this.dataAccionPuntualPI.catalogo.filter(
            (item) => ccExternaDosEstratega.includes(item.cdDescripcionDos)
          );

          const getCustomNameEstrategia = (
            item: IItemCatalogoResponse
          ): string => `${item.ccExterna}. ${item.cdOpcion}`;
          this.questions[7].options = mapCatalogData({
            data: {
              mensaje: {
                codigo: '200',
                mensaje: '',
              },
              catalogo: accionPuntualFilter,
            },
            withIdx: false,
            withOrder: true,
            keyForOrder: 'ccExterna',
            getCustomValue: getCustomNameEstrategia,
          });
          this.form.get('accionPuntual')?.enable();
        }
      });
  }

  createQuestions() {
    this.questions = [
      new DropdownQuestion({
        idElement: 89,
        nane: 'nombreProyecto',
        label: 'Nombre del Proyecto',
        filter: true,
        validators: [Validators.required, Validators.maxLength(200)],
      }),

      new TextboxQuestion({
        idElement: 90,
        nane: 'claveProyecto',
        label: 'Clave del Proyecto',
        value: '',
        disabled: true,
        validators: [Validators.required],
      }),

      new TextboxQuestion({
        idElement: 91,
        nane: 'claveActividad',
        label: 'Clave de la Actividad',
        disabled: true,
        validators: [Validators.required],
      }),

      new TextareaQuestion({
        idElement: 92,
        nane: 'nombreActividad',
        label: 'Nombre de la Actividad',
        rows: 2,
        validators: [Validators.required, Validators.maxLength(200)],
      }),

      new TextareaQuestion({
        idElement: 93,
        nane: 'descripcion',
        label: 'Descripción',
        rows: 4,
        validators: [Validators.required, Validators.maxLength(600)],
      }),
    ];

    this.questions.push(
      new DropdownQuestion({
        idElement: 94,
        nane: 'objetivoPrioritario',
        label: 'Objetivo Prioritário',
        disabled: true,
        filter: true,
        multiple: true,
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        idElement: 95,
        nane: 'estrategiaPrioritaria',
        label: 'Estrategia Prioritária',
        disabled: true,
        multiple: true,
        filter: true,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        idElement: 96,
        nane: 'accionPuntual',
        label: 'Acción Puntual',
        disabled: true,
        multiple: true,
        filter: true,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new TextareaQuestion({
        idElement: 97,
        nane: 'artActividadesPresenteEjercicio',
        label: 'Articulación con Actividades del Presente Ejercicio',
        validators: [Validators.required, Validators.maxLength(2000)],
      })
    );

    this.questions.push(
      new CheckboxQuestion({
        nane: 'actividadTrasversal',
        label: 'Actividad Transversal',
      })
    );

    this.questions.push(
      new CheckboxQuestion({
        nane: 'reunionesRealizar',
        label: 'Reuniones a Realizarse',
      })
    );

    this.questions.push(
      new TextboxQuestion({
        idElement: 98,
        nane: 'tema',
        label: 'Tema',
        disabled: true,
        validators: [Validators.required, Validators.maxLength(100)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        idElement: 99,
        nane: 'alcance',
        label: 'Alcance',
        disabled: true,
        filter: true,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new TextboxQuestion({
        idElement: 100,
        nane: 'lugar',
        label: 'Lugar',
        disabled: true,
        validators: [Validators.required, Validators.maxLength(100)],
      })
    );

    this.questions.push(
      new TextareaQuestion({
        idElement: 101,
        nane: 'actores',
        label: 'Actores',
        disabled: true,
        validators: [Validators.required, Validators.maxLength(300)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        idElement: 102,
        nane: 'fechatentativa',
        label: 'Fecha Tentativa',
        multiple: true,
        disabled: true,
        filter: true,
        options: [
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
        ],
        validators: [Validators.required, Validators.maxLength(50)],
      })
    );

    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.valueChanges.pipe(takeUntil(this.notifier)).subscribe(() => {
      this.formUnchanged = false;
    });
    this.validateMettings();
  }

  get getQuestions() {
    return [
      new DropdownQuestion({
        idElement: 138,
        nane: 'name',
        value: '',
        label: 'Comentarios',
        filter: true,
        options: [],
        validators: [Validators.required],
      }),
    ];
  }

  async validateMettings() {
    this.form
      .get('reunionesRealizar')
      ?.valueChanges.subscribe((value: boolean) => {
        if (value) {
          this.form.get('tema')?.enable();
          this.form.get('alcance')?.enable();
          this.form.get('lugar')?.enable();
          this.form.get('actores')?.enable();
          this.form.get('fechatentativa')?.enable();
        } else {
          this.form.get('tema')?.disable();
          this.form.get('alcance')?.disable();
          this.form.get('lugar')?.disable();
          this.form.get('actores')?.disable();
          this.form.get('fechatentativa')?.disable();
        }
      });
    if (!this._stateView.editable) {
      this.form.disable();
      this.actions = {
        view: true,
      };
    }
    this.editable = this._stateView.editable;
    if (this.selectedAjustesProyectoPAA) {
      this.validation = true;
      this.disabledAppValidate = true;
    } else {
      this.validation = this._stateView.validation;
    }
  }

  validateWhereComeFrom() {
    const selectedUploadMasiveProyectoPAA = this.ls.get(
      'selectedUploadMasiveProyectoPAA'
    );
    if (selectedUploadMasiveProyectoPAA) {
      if (
        !this.questions[0].optionsArray ||
        this.questions[0].optionsArray.length === 0
      ) {
        setTimeout(() => {
          this.validateWhereComeFrom();
        }, 500);
      } else {
        this.form
          .get('nombreProyecto')
          ?.setValue(selectedUploadMasiveProyectoPAA.value.idProyecto);
      }
    }
    if (this.selectedAjustesProyectoPAA) {
      if (
        !this.questions[0].optionsArray ||
        this.questions[0].optionsArray.length === 0
      ) {
        setTimeout(() => {
          this.validateWhereComeFrom();
        }, 500);
      } else {
        this.form
          .get('nombreProyecto')
          ?.setValue(this.selectedAjustesProyectoPAA.value.idProyecto);
      }
    }

    if (this.selectedValidateProyectoPAA) {
      if (
        !this.questions[0].optionsArray ||
        this.questions[0].optionsArray.length === 0
      ) {
        setTimeout(() => {
          this.validateWhereComeFrom();
        }, 500);
      } else {
        this.form
          .get('nombreProyecto')
          ?.setValue(this.selectedValidateProyectoPAA.value.idProyecto);
        // this.idSaveValidar = this.selectedValidateProyectoPAA.value.idProyecto;
      }
    }
  }

  getColWidth(widthLess: number, percent: number): number {
    return this._tblWidthService.getColWidth(widthLess, percent);
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
    this.notifier.complete();
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return this.formUnchanged;
  }

  submit() {
    const formBody = this.form.getRawValue();
    if (formBody.cveActividad === '' || formBody.nombreActividad === '') {
      this._alertService.showAlert(
        'Datos indispensables faltantes, revisar existencia de proyecto o nombre de actividad.'
      );
      this.resetAllForm();
    } else {
      let datosMapeadosFechaTentativa: any = [];
      if (formBody.fechatentativa) {
        datosMapeadosFechaTentativa = formBody.fechatentativa.map(
          (fechaTentativa, index) => {
            return {
              idCatalogoFecha: fechaTentativa,
            };
          }
        );
      }
      const numberClaveActividad = formBody.claveActividad.split('-');

      this.isSubmiting = true;
      if (!this.isUpdate) {
        const dataCreateActivity = {
          cveActividad: parseInt(numberClaveActividad[1]),
          idProyecto: formBody.nombreProyecto, //
          nombreActividad: formBody.nombreActividad,
          descripcion: formBody.descripcion,
          objetivo: this.generateArrayCatalogMasterIds(
            formBody.objetivoPrioritario
          ),
          estrategia: this.generateArrayCatalogMasterIds(
            formBody.estrategiaPrioritaria
          ),
          action: this.generateArrayCatalogMasterIds(formBody.accionPuntual),
          articulacionActividad: formBody.artActividadesPresenteEjercicio,
          actividadTransversal:
            formBody.actividadTrasversal == true ||
              formBody.actividadTrasversal != null
              ? 1
              : 0,
          reuniones: formBody.reunionesRealizar == true ? 1 : 0,
          tema: formBody.tema,
          alcance: formBody.alcance || 0,
          lugar: formBody.lugar,
          actores: formBody.actores,
          estatus: this.form.valid ? 'C' : 'I',
          cveUsuario: this.dataUser.cveUsuario,
          fechaTentativa: datosMapeadosFechaTentativa,
        };
        this.activitiesService.createActivity(dataCreateActivity).subscribe({
          next: (value) => {
            this.isSubmiting = false;
            this.getActivities(formBody.nombreProyecto, true);
            this.resetAllForm();
            this.dataSelected = null;
            this._alertService.showAlert('Se Guardó Correctamente');
            this.claveActividad = 0;
          },
          error: (error) => {
            this.isSubmiting = false;
          },
        });
      } else {
        const dataUpdateActivity = {
          cveActividad: parseInt(numberClaveActividad[1]),
          idProyecto: formBody.nombreProyecto,
          nombreActividad: formBody.nombreActividad,
          descripcion: formBody.descripcion,
          objetivo: this.generateArrayCatalogMasterIds(
            formBody.objetivoPrioritario
          ),
          estrategia: this.generateArrayCatalogMasterIds(
            formBody.estrategiaPrioritaria
          ),
          action: this.generateArrayCatalogMasterIds(formBody.accionPuntual),
          articulacionActividad: formBody.artActividadesPresenteEjercicio,
          actividadTransversal: formBody.actividadTrasversal ? 1 : 0,
          reuniones: formBody.reunionesRealizar ? 1 : 0,
          tema: formBody.tema,
          alcance: formBody.alcance || 0,
          lugar: formBody.lugar,
          actores: formBody.actores,
          estatus: this.form.valid ? 'C' : 'I',
          cveUsuario: this.dataUser.cveUsuario,
          fechaTentativa: datosMapeadosFechaTentativa,
        };
        this.activitiesService
          .updateActivity(
            String(this.dataSelected?.idActividad),
            dataUpdateActivity
          )
          .subscribe({
            next: (value) => {
              this.isSubmiting = false;
              this.getActivities(formBody.nombreProyecto, true);
              this.resetAllForm();
              this.dataSelected = null;
              this._alertService.showAlert('Se Modificó Correctamente');
              this.claveActividad = 0;
            },
            error: (error) => {
              this.isSubmiting = false;
            },
          });
        this.isUpdate = false;
        this.disabledSubmiting = false;
      }
    }
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this.getCatalogs();
    this.getProyectsSwitch();
    this.loading = false;
  }

  getActivities(idProject: number, cleanClaveActividad = false) {
    this.activitiesService
      .getActivityByProjectId(idProject)
      .subscribe(async (response) => {
        this.data = [];
        const tmpData: IItemActivitiesResponse[] = [];
        if (response.codigo === '200' && response.respuesta?.length > 0) {
          for (const item of response.respuesta) {
            const claveProyecto = this.dataProjects.find(
              (proyecto: IItemProjectsResponse) =>
                proyecto.idProyecto === item.idProyecto
            );
            if (!claveProyecto) {
              return;
            }
            if (item.csEstatus !== 'B') {
              tmpData.push({
                ...item,
                cveProyecto: getCveProyecto({
                  cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
                  cveProyecto: +claveProyecto?.clave,
                }),
                cveActividad: getNumeroActividad(item.cveActividad),
                csEstatus: getGlobalStatus(
                  item.csEstatus,
                  this.dataUser.idTipoUsuario
                ),
              });
            }
            if (item.csEstatus === 'C') {
            }
          }
        }
        this.data = tmpData.reverse();
        const textboxQuestionClaveActividad = this
          .questions[2] as TextboxQuestion;
        if (!cleanClaveActividad) {
          this.claveActividad = 0;
          this.claveActividad = this.data.length + 1;
          textboxQuestionClaveActividad.value = `${this.form.get('claveProyecto')?.value
            }-${getNumeroActividad(this.claveActividad)}`;
          this.form
            .get('claveActividad')
            ?.setValue(textboxQuestionClaveActividad.value);
        } else {
          textboxQuestionClaveActividad.value = null;
          this.form
            .get('claveActividad')
            ?.setValue(textboxQuestionClaveActividad.value);
        }
      });
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['alcance']
      ),
      this.goalsService.getCatalogObjetivo(this.yearNav),
      this.strategiesService.getCatalogEstrategia(this.yearNav),
      this.actionsService.getCatalogAccion(this.yearNav),
    ])
      .pipe(take(1))
      .subscribe(
        ([
          dataAlcance,
          dataObjetivosPrioritarioAnhio,
          datEstrategiaPrioritariaAnhio,
          dataAccionPuntualPIAnhio,
        ]) => {
          this.dataObjetivosPrioritario = dataObjetivosPrioritarioAnhio;
          this.dataEstrategiaPrioritaria = datEstrategiaPrioritariaAnhio;
          this.dataAccionPuntualPI = dataAccionPuntualPIAnhio;
          this.dataAlcance = dataAlcance;
          this.questions[12].options = mapCatalogData({
            data: this.dataAlcance,
          });
          this.validateWhereComeFrom();
        }
      );
  }

  getProyectsSwitch() {
    if (this.selectedAjustesProyectoPAA || this.selectedValidateProyectoPAA) {
      if (this.selectedAjustesProyectoPAA) {
        this.dataProjects = [this.selectedAjustesProyectoPAA.value];
      } else {
        this.dataProjects = [this.selectedValidateProyectoPAA.value];
      }
      this.questions[0].options = mapOptionProjects(this.dataProjects);
    } else if (this.selectedConsultaProyectoPAA) {
      this.getProjectsConsulta();
    } else {
      this.getProjectsConsulta();
    }
  }

  getProjects() {
    this.dataProjects = [];
    this.projectsService.getProjectByAnnio(this.yearNav).subscribe({
      next: (value) => {
        if (value.mensaje.codigo === '200' && value.proyecto?.length) {
          this.dataProjects = value.proyecto.filter(
            (item) =>
              item.claveUnidad === this.dataUser.perfilLaboral.cveUnidad &&
              item.estatus === 'C'
          );
          this.questions[0].options = mapOptionProjects(this.dataProjects);
        }
      },
    });
  }

  getProjectsConsulta() {
    this.data = [];
    this.projectsService
      .getProjectByAnnioParaValidar(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200' && value.proyecto?.length > 0) {
            this.dataProjects = value.proyecto
              .filter((item) => {
                if (item.estatus !== 'B') {
                  if (
                    (this.dataUser.idTipoUsuario === 'ENLACE' ||
                      this.dataUser.idTipoUsuario === 'PLANEACION' ||
                      this.dataUser.idTipoUsuario === 'PRESUPUESTO' ||
                      (this.dataUser.idTipoUsuario === 'SUPERVISOR' &&
                        this.dataUser.perfilLaboral.ixNivel === 1)) &&
                    item.claveUnidad === this.dataUser.perfilLaboral.cveUnidad
                  ) {
                    return true;
                  }

                  if (
                    this.dataUser.idTipoUsuario === 'CONSULTOR' ||
                    (this.dataUser.idTipoUsuario === 'SUPERVISOR' &&
                      this.dataUser.perfilLaboral.ixNivel != 1)
                  ) {
                    return true;
                  }
                }
                return false;
              })
              .map((item) => {
                return {
                  ...item,
                  claveProyecto: getCveProyecto({
                    cveProyecto: +item.clave,
                    cveUnidad: item.claveUnidad,
                  }),
                  estatusFull: getGlobalStatus(item.estatus),
                };
              });
            this.questions[0].options = mapOptionProjects(this.dataProjects);
            if (this.selectedConsultaProyectoPAA) {
              this.form
                .get('nombreProyecto')
                ?.setValue(this.selectedConsultaProyectoPAA?.value.idProyecto);
            }
            this.form.get('nombreProyecto')?.enable({ emitEvent: false });
          }
        },
      });
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: IItemActivitiesResponse = event.value;
    this.customBtn = '';
    switch (event.name) {
      case TableConsts.actionButton.view:
        this._formsState.setReadonly(true);
        this._formsState.setProduct(event.value);
        this.resetAllForm();
        this.isCleanForm = true;
        this.dataSelected = dataAction;
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.form.disable({ emitEvent: false });
          this.form.controls['nombreProyecto'].enable({ emitEvent: false });
          this.disabledSubmiting = true;
          if (
            this.selectedValidateProyectoPAA ||
            this.selectedAjustesProyectoPAA
          ) {
            this.idSaveValidar = dataAction.idActividad;
          }
        }, 100);
        break;
      case TableConsts.actionButton.edit:
        this._formsState.setReadonly(false);
        this._formsState.setProduct(event.value);
        this.disabledSubmiting = false;
        this.isUpdate = true;
        this.form.enable({ emitEvent: false });
        this.resetAllForm();
        this.isCleanForm = true;
        this.dataSelected = dataAction;
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.form.get('claveProyecto')?.disable({ emitEvent: false });
          this.form.get('claveActividad')?.disable({ emitEvent: false });
          if (this.selectedAjustesProyectoPAA) {
            this.idSaveValidar = dataAction.idActividad;
          }
        }, 100);
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar la Actividad?',
          });
          if (confirm) {
            this.activitiesService
              .deleteActivity(dataAction.idActividad, {
                id: dataAction.idActividad,
                usuario: this.dataUser.cveUsuario,
              })
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this._alertService.showAlert('Se Eliminó Correctamente');
                    this.getActivities(dataAction.idProyecto, true);
                    this.resetAllForm();
                  }
                },
                error: (err) => { },
              });
          }
        }
        break;
    }
    this.form.get('claveProyecto')?.disable();
    this.form.get('claveActividad')?.disable();
  }

  uploadDataToForm(dataAction: IItemActivitiesResponse) {
    const claveProyecto = this.dataProjects.find(
      (proyecto: IItemProjectsResponse) =>
        proyecto.idProyecto === dataAction.idProyecto
    );
    if (!claveProyecto) {
      return;
    }
    let cveProyecto = getCveProyecto({
      cveUnidad: this.dataUser.perfilLaboral.cveUnidad,
      cveProyecto: +claveProyecto?.clave,
    });
    this.form.controls['nombreProyecto'].setValue(dataAction.idProyecto, {
      emitEvent: false,
    });
    this.form.controls['claveProyecto'].setValue(cveProyecto);
    this.form.controls['claveActividad'].setValue(
      `${cveProyecto}-${getNumeroActividad(dataAction.cveActividad)}`,
      { emitEvent: false }
    );
    this.form.controls['nombreActividad'].setValue(
      dataAction.cxNombreActividad
    );
    this.form.controls['descripcion'].setValue(dataAction.cxDescripcion);
    this.form.controls['objetivoPrioritario'].setValue(
      this.generateArrayInverseCatalogMasterIds(dataAction.objetivo)
    );
    this.form.controls['estrategiaPrioritaria'].setValue(
      this.generateArrayInverseCatalogMasterIds(dataAction.estrategia)
    );
    this.form.controls['accionPuntual'].setValue(
      this.generateArrayInverseCatalogMasterIds(dataAction.accion)
    );
    this.form.controls['artActividadesPresenteEjercicio'].setValue(
      dataAction.cxArticulacionActividad
    );
    this.form.controls['actividadTrasversal'].setValue(
      dataAction.icActividadTransversal == 0 ? false : true
    );
    this.form.controls['reunionesRealizar'].setValue(
      dataAction.ixReunion == 0 ? null : true
    );

    this.form.controls['tema'].setValue(dataAction.cxTema);
    this.form.controls['alcance'].setValue(dataAction.idAlcance);
    this.form.controls['lugar'].setValue(dataAction.cxLugar);
    this.form.controls['actores'].setValue(dataAction.cxActores);
    const fechaTentativa: number[] = [];
    for (const item of dataAction.fechaTentativa) {
      fechaTentativa.push(item.idMes);
    }
    this.form.controls['fechatentativa'].setValue(fechaTentativa);
  }

  generateArrayCatalogMasterIds(catalogsIds: number[]) {
    let masterCatalogo: MasterCatalogsIds[] = [];
    catalogsIds?.map((item) => {
      masterCatalogo.push({
        masterCatalogo: {
          idCatalogo: item,
        },
      });
    });
    return masterCatalogo;
  }

  generateArrayInverseCatalogMasterIds(masterCatalogoIds: MasterCatalogsIds[]) {
    let catalogsIds: number[] = [];
    masterCatalogoIds?.map((item) => {
      catalogsIds.push(item.masterCatalogo.idCatalogo);
    });
    return catalogsIds;
  }

  newActivity(from: string) {
    this.form.enable({ emitEvent: false });
    this.resetAllForm();
    this.form.get('objetivoPrioritario')?.disable();
    this.form.get('estrategiaPrioritaria')?.disable();
    this.form.get('accionPuntual')?.disable();
    this.disabledSubmiting = false;
    this.isCleanForm = false;
    this.dataSelected = null;
    this.isUpdate = false;
    this.form.get('claveProyecto')?.disable();
    this.form.get('claveActividad')?.disable();
    if (from !== 'cleanForm' && this.selectedAjustesProyectoPAA) {
      this.form
        .get('nombreProyecto')
        ?.setValue(this.selectedAjustesProyectoPAA?.value.idProyecto, {
          emitEvent: false,
        });
      // this.idSaveValidar = this.selectedAjustesProyectoPAA?.value.idProyecto ?? 0;
    }
  }

  resetAllForm() {
    this.form.reset({ emitEvent: false });
  }
}
