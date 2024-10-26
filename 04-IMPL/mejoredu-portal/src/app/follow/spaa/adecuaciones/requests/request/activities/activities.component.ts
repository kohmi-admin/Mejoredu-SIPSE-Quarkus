import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import {
  Observable,
  Subject,
  Subscription,
  lastValueFrom,
  takeUntil,
} from 'rxjs';
import { AlertService } from '@common/services/alert.service';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TblWidthService } from '@common/services/tbl-width.service';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { CheckboxQuestion } from '@common/form/classes/question-checkbox.class';
import { TableColumn } from '@common/models/tableColumn';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import {
  ICatalogResponse,
  IItemCatalogoResponse,
} from '@common/interfaces/catalog.interface';
import { ProjectsService } from '@common/services/seguimiento/projects.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import * as SecureLS from 'secure-ls';
import { mapOptionProjects } from '@common/mapper/data-options.mapper';
import {
  IItemActivitiesResponse,
  MasterCatalogsIds,
} from '@common/interfaces/activities.interface';
import {
  getCveProyecto,
  getGlobalStatus,
  getIdAdecuancionSolicitud,
  getNumeroActividad,
} from '@common/utils/Utils';
import { ActivitiesFollowService } from '@common/services/seguimiento/activities.service';
import { IItemConsultarPRoyectosResponse } from '@common/interfaces/seguimiento/consultarProyectos.interface';
import { TIPO_APARTADO } from '../enum/tipoApartado.enum';
import { MODIFICATION_TYPE } from '../enum/modification.enum';
import { PModMoveService } from '@common/services/seguimiento/modificacion/pModMove.service';
import { IItemConsultaProyectoPorIdResponse } from '@common/interfaces/seguimiento/proyectos.interface';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  ls = new SecureLS({ encodingType: 'aes' });
  @Output() setRecord: EventEmitter<any> = new EventEmitter<any>();
  @Input() modify: boolean = false;
  @Input() canSelectOne: boolean = false;
  @Input() position: 'left' | 'right' | null = null;
  @Input() catObjetivosPrioritarioR!: ICatalogResponse;
  @Input() catEstrategiaPrioritariaR!: ICatalogResponse;
  @Input() catAccionPuntualPIR!: ICatalogResponse;
  @Input() catAlcanceR!: ICatalogResponse;
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
  columnsModificationTable: TableColumn[] = [
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
      columnDef: 'nombreActividad',
      header: 'Nombre de la Actividad',
      alignLeft: true,
    },
    {
      columnDef: 'fullEstatus',
      header: 'Estatus Modificación',
      width: '110px',
    },
  ];
  actions: TableActionsI = {
    edit: true,
    delete: true,
    view: true,
  };
  loading = true;

  notifier = new Subject();
  formUnchanged = true;
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  private _body = document.querySelector('body');

  dataPP: any[] = [];
  validation = false;
  dataUser: IDatosUsuario;
  yearNav: string = '';
  whatModuleStart: string | undefined;
  selectedSolicitud: any;
  dataObjetivosPrioritario: ICatalogResponse[] | any = [];
  dataEstrategiaPrioritaria: ICatalogResponse[] | any = [];
  dataAccionPuntualPI: ICatalogResponse[] | any = [];
  dataAlcance: ICatalogResponse[] | any = [];
  dataProjects: IItemConsultarPRoyectosResponse[] = [];
  dataSelected: IItemActivitiesResponse | null = null;
  claveActividad: number = 0;
  disabledSubmiting: boolean = false;
  isSubmiting: boolean = false;
  objetivosPrioritariosFilter: IItemCatalogoResponse[] = [];
  estrategiaPrioritariaFilter: IItemCatalogoResponse[] = [];
  projectSelected: any = null;
  activitySelected: any = null;
  pModMoveSubscription: Subscription | undefined;
  canEdit: boolean = true;
  dataModificacionTable: any[] = [];

  constructor(
    private _formBuilder: QuestionControlService,
    private _alertService: AlertService,
    private _tblWidthService: TblWidthService,
    private pModMoveService: PModMoveService,
    private projectsService: ProjectsService,
    private activitiesFollowService: ActivitiesFollowService
  ) {
    this.canEdit = this.ls.get('canEdit');
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.selectedSolicitud = this.ls.get('selectedSolicitud');
    this.whatModuleStart = this.ls.get('whatModuleStart');
    this.canEdit = this.selectedSolicitud.estatusId !== 2237;
    this._body?.classList.add('hideW');
    if (!this.canEdit) {
      this.actions.delete = false;
      this.actions.edit = false;
    }
  }

  ngOnInit(): void {
    if (this.position) {
      this.whatModuleStart = undefined;
    }
    this.setCatalogsInput();
    this.buildForm();
    this.validateWhatParamsInit();
    this.suscribeForm();
  }

  suscribeForm() {
    this.form
      .get('nombreProyecto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          if (this.position === 'left') {
            this.questions[3].options = [];
            this.form
              .get('nombreActividad')
              ?.setValue('', { emitEvent: false });
            this.form.get('nombreActividad')?.disable({ emitEvent: false });
            this.resetAllForm();

            this.pModMoveService.sendData({
              from: 'left',
              isNew: false,
              viewType: 'view',
              data: 'resetAllForm',
            });
          }
          if (this.position !== 'right') {
            this.getActivities(value);
          }

          this.questions[5].options = [];
          const projectSelected = this.dataProjects.find(
            (proyecto: IItemConsultarPRoyectosResponse) =>
              proyecto.idProyecto === value
          );

          if (!projectSelected?.contribucionObjetivoPrioritarioPI) {
            return;
          }
          this.projectSelected = projectSelected;
          const idsObjetivosPrioritariosProject =
            projectSelected.contribucionObjetivoPrioritarioPI.map(
              (item) => item.idCatalogo
            );

          this.objetivosPrioritariosFilter =
            this.dataObjetivosPrioritario.catalogo.filter((item) =>
              idsObjetivosPrioritariosProject.includes(item.idCatalogo)
            );

          this.questions[5].options = this.objetivosPrioritariosFilter.map(
            (item) => ({
              id: item.idCatalogo,
              value: `${item.ccExterna}. ${item.cdOpcion}`,
            })
          );
          if (this.position !== 'left' && this.canEdit) {
            this.form.get('objetivoPrioritario')?.enable();
          }

          this.form.get('claveProyecto')?.setValue(
            getCveProyecto({
              cveUnidad: projectSelected.claveUnidad,
              cveProyecto: +projectSelected?.clave,
            })
          );
          this.getSecuencialActividad(projectSelected);
        }
      });

    if (this.position === 'left') {
      this.form
        .get('nombreActividad')
        ?.valueChanges.pipe(takeUntil(this.notifier))
        .subscribe((value) => {
          if (value) {
            const activitySelected = this.data.find(
              (item) => item.idActividad === value
            );
            if (activitySelected) {
              let isNewForModification = true;
              let project = this.projectSelected;
              let activityMod = null;
              if (this.dataModificacionTable.length) {
                const findMod = this.dataModificacionTable.find(
                  (item) => item.actividadReferencia.idActividad === value
                );
                if (findMod) {
                  isNewForModification = false;
                  project = findMod.project;
                  activityMod = findMod.actividadModificacion;
                }
              }
              this.onTableAction({ name: 'view', value: activitySelected });
              this.pModMoveService.sendData({
                from: 'left',
                isNew: isNewForModification,
                viewType: 'edit',
                data: {
                  selectedProject: project,
                  selectedActivity: activitySelected,
                  selectedActividadModification: activityMod,
                },
              });
            }
          }
        });
    }

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

          this.questions[6].options = this.estrategiaPrioritariaFilter.map(
            (item) => {
              return {
                id: item.idCatalogo,
                value: `${item.ccExternaDos}. ${item.cdOpcion}`,
              };
            }
          );
          this.form
            .get('estrategiaPrioritaria')
            ?.enable({ emitEvent: !this.dataSelected });
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

          this.questions[7].options = accionPuntualFilter.map((item) => {
            return {
              id: item.idCatalogo,
              value: `${item.ccExterna}. ${item.cdOpcion}`,
            };
          });
          this.form
            .get('accionPuntual')
            ?.enable({ emitEvent: !this.dataSelected });
        }
      });
    if (this.position) {
      this.pModMoveSubscription = this.pModMoveService.pModMove$.subscribe({
        next: (value) => {
          if (value) {
            if (this.position === 'right' && value.from === 'left') {
              if (value.data === 'resetAllForm') {
                this.resetAllForm();
                this.activitySelected = null;
                this.form.disable({ emitEvent: false });
                this.form
                  .get('nombreActividad')
                  ?.setValue('', { emitEvent: false });
                this.questions[0].options = [];
              } else {
                this.dataSelected = null;
                if (value.isNew) {
                  this.activitySelected = value.data.selectedActivity;
                  this.dataProjects = [value.data.selectedProject];
                  this.questions[0].options = this.dataProjects.map((item) => {
                    return {
                      id: item.idProyecto,
                      value: item.nombre,
                    };
                  });
                  this.form
                    .get('nombreProyecto')
                    ?.setValue(value.data.selectedProject.idProyecto, {
                      emitEvent: true,
                    });

                  this.onTableAction({
                    name: this.canEdit ? value.viewType : 'view',
                    value: value.data.selectedActivity,
                  });
                } else {
                  this.dataSelected = value.data.selectedActividadModification;
                  this.activitySelected =
                    value.data.selectedActividadModification;

                  this.projectSelected = value.data.selectedProject;
                  this.dataProjects = [this.projectSelected];
                  this.questions[0].options = this.dataProjects.map((item) => {
                    return {
                      id: item.idProyecto,
                      value: item.nombre,
                    };
                  });
                  this.form
                    .get('nombreProyecto')
                    ?.setValue(this.projectSelected.idProyecto, {
                      emitEvent: false,
                    });
                  this.data = [this.dataSelected];
                  this.questions[3].options = this.data.map((item) => {
                    return {
                      id: item.idActividad,
                      value: item.cxNombreActividad,
                    };
                  });
                  this.onTableAction({
                    name: this.canEdit ? value.viewType : 'view',
                    value: this.dataSelected,
                  });
                }
              }
            }
            if (this.position === 'left' && value.from === 'right') {
              if (value.data === 'itemSaved') {
                this.getConsultarActividadByIdAdecuacion();
              }
            }
          }
        },
      });
    }

    this.form
      .get('reunionesRealizar')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value: boolean) => {
        if (value) {
          this.form.get('tema')?.enable({ emitEvent: false });
          this.form.get('alcance')?.enable({ emitEvent: false });
          this.form.get('lugar')?.enable({ emitEvent: false });
          this.form.get('actores')?.enable({ emitEvent: false });
          this.form.get('fechatentativa')?.enable({ emitEvent: false });
        } else {
          this.form.get('tema')?.disable({ emitEvent: false });
          this.form.get('alcance')?.disable({ emitEvent: false });
          this.form.get('lugar')?.disable({ emitEvent: false });
          this.form.get('actores')?.disable({ emitEvent: false });
          this.form.get('fechatentativa')?.disable({ emitEvent: false });
        }
      });
  }

  async buildForm(): Promise<void> {
    this.questions = [
      new DropdownQuestion({
        nane: 'nombreProyecto',
        label: 'Nombre del Proyecto',
        filter: true,
        validators: [Validators.required, Validators.maxLength(200)],
      }),

      new TextboxQuestion({
        nane: 'claveProyecto',
        label: 'Clave del Proyecto',
        disabled: true,
        validators: [Validators.required],
      }),

      new TextboxQuestion({
        nane: 'claveActividad',
        label: 'Clave de la Actividad',
        disabled: true,
        value: '',
        validators: [Validators.required],
      }),
    ];

    if (this.position === 'left') {
      this.questions.push(
        new DropdownQuestion({
          filter: true,
          nane: 'nombreActividad',
          label: 'Nombre de la Actividad',
          validators: [Validators.required, Validators.maxLength(200)],
        })
      );
    } else {
      this.questions.push(
        new TextareaQuestion({
          nane: 'nombreActividad',
          label: 'Nombre de la Actividad',
          validators: [Validators.required, Validators.maxLength(200)],
        })
      );
    }

    this.questions.push(
      new TextareaQuestion({
        nane: 'descripcion',
        label: 'Descripción',
        rows: 4,
        validators: [Validators.required, Validators.maxLength(600)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
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
        nane: 'estrategiaPrioritaria',
        label: 'Estrategia Prioritaria',
        disabled: true,
        filter: true,
        multiple: true,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'accionPuntual',
        label: 'Acción Puntual',
        disabled: true,
        filter: true,
        multiple: true,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new TextareaQuestion({
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
        nane: 'tema',
        label: 'Tema',
        disabled: true,
        validators: [Validators.required, Validators.maxLength(100)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'alcance',
        label: 'Alcance',
        disabled: true,
        filter: true,
        options: mapCatalogData({
          data: this.catAlcanceR,
        }),
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new TextboxQuestion({
        nane: 'lugar',
        label: 'Lugar',
        disabled: true,
        validators: [Validators.required, Validators.maxLength(300)],
      })
    );

    this.questions.push(
      new TextareaQuestion({
        nane: 'actores',
        label: 'Actores',
        disabled: true,
        validators: [Validators.required, Validators.maxLength(300)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
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
    if (!this.canEdit) {
      this.form.disable({ emitEvent: false });
      this.form.get('nombreProyecto')?.enable({ emitEvent: true });
    }
    if (this.position) {
      this.form.disable({ emitEvent: false });
      if (this.position === 'left') {
        this.form.get('nombreProyecto')?.enable({ emitEvent: false });
      }
    }
  }

  getColWidth(widthLess: number, percent: number): number {
    return this._tblWidthService.getColWidth(widthLess, percent);
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
          (fechaTentativa) => {
            return {
              idCatalogoFecha: fechaTentativa,
            };
          }
        );
      }
      const numberClaveActividad = formBody.claveActividad.split('-');

      this.isSubmiting = true;
      let idAdecuacionSolicitud =
        this.position === 'right'
          ? getIdAdecuancionSolicitud({
            tipoApartado: TIPO_APARTADO.actividades,
            tipoModificacion: MODIFICATION_TYPE.modificacion,
          })
          : getIdAdecuancionSolicitud({
            tipoApartado: TIPO_APARTADO.actividades,
            tipoModificacion: MODIFICATION_TYPE.alta,
          });
      if (!this.dataSelected) {
        const dataCreateActivity = {
          cveActividad: parseInt(numberClaveActividad[1]),
          idProyecto: formBody.nombreProyecto, //
          nombreActividad: formBody.nombreActividad,
          descripcion: formBody.descripcion,
          objetivo: this.generateArrayCatalogMasterIds(
            formBody.objetivoPrioritario || []
          ),
          estrategia: this.generateArrayCatalogMasterIds(
            formBody.estrategiaPrioritaria || []
          ),
          action: this.generateArrayCatalogMasterIds(
            formBody.accionPuntual || []
          ),
          articulacionActividad: formBody.artActividadesPresenteEjercicio,
          actividadTransversal: formBody.actividadTrasversal == true ? 1 : 0,
          reuniones: formBody.reunionesRealizar == true ? 1 : 0,
          tema: formBody.tema,
          alcance: formBody.alcance || 0,
          lugar: formBody.lugar,
          actores: formBody.actores,
          estatus: this.form.valid ? 'C' : 'I',
          cveUsuario: this.dataUser.cveUsuario,
          fechaTentativa: datosMapeadosFechaTentativa,
          idAdecuacionSolicitud,
          idActividadReferencia:
            this.position === 'right'
              ? this.activitySelected.idActividad
              : null,
        };
        this.activitiesFollowService
          .createActivity(dataCreateActivity)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmiting = false;
              if (value.codigo === '200') {
                this._alertService.showAlert('Se Guardó Correctamente');
                if (!this.position) {
                  this.getActivities(formBody.nombreProyecto);
                  if (this.whatModuleStart === 'activities') {
                    this.validateWhatParamsInit();
                  }
                  this.resetAllForm();
                  this.dataSelected = null;
                }
                if (this.position === 'right') {
                  lastValueFrom(
                    this.activitiesFollowService.getActivityById(
                      value.respuesta.idActividad
                    )
                  ).then((response) => {
                    this.pModMoveService.sendData({
                      from: 'right',
                      isNew: false,
                      viewType: 'view',
                      data: 'itemSaved',
                    });
                    const newDataSelected: any = response.respuesta;
                    this.dataSelected = newDataSelected;
                    this.onTableAction({
                      name: 'edit',
                      value: response.respuesta,
                    });
                  });
                }
              }
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
            formBody.objetivoPrioritario || 0
          ),
          estrategia: this.generateArrayCatalogMasterIds(
            formBody.estrategiaPrioritaria || 0
          ),
          action: this.generateArrayCatalogMasterIds(
            formBody.accionPuntual || 0
          ),
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
          idAdecuacionSolicitud,
          idActividadReferencia:
            this.position === 'right'
              ? this.activitySelected.idActividad
              : null,
        };
        this.activitiesFollowService
          .updateActivity(
            String(this.dataSelected?.idActividad),
            dataUpdateActivity
          )
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmiting = false;
              this._alertService.showAlert('Se Modificó Correctamente');
              if (value.mensaje.codigo === '200') {
                if (!this.position) {
                  this.getActivities(formBody.nombreProyecto);
                  this.resetAllForm();
                  this.dataSelected = null;
                }
                if (this.position === 'right') {
                  this.pModMoveService.sendData({
                    from: 'right',
                    isNew: false,
                    viewType: 'view',
                    data: 'itemSaved',
                  });
                }
              }
            },
            error: (error) => {
              this.isSubmiting = false;
            },
          });
        this.disabledSubmiting = false;
      }
    }
  }

  validateWhatParamsInit() {
    if (this.position) {
      if (this.position === 'left') {
        this.getProjects({
          excluirCortoPlazo: false,
          priorizarProyectoAsociado: false,
          idSolicitud: this.selectedSolicitud.idSolicitud ?? 0,
        });
      }
    } else {
      if (
        this.whatModuleStart === 'proyects' ||
        this.whatModuleStart === 'activities'
      ) {
        this.getProjects({
          excluirCortoPlazo: true,
          priorizarProyectoAsociado: true,
          idSolicitud: this.selectedSolicitud.idSolicitud ?? 0,
        });
      } else {
        this.getProjects({
          excluirCortoPlazo: false,
          priorizarProyectoAsociado: false,
          idSolicitud: 0,
        });
      }
    }
  }

  setCatalogsInput() {
    this.dataObjetivosPrioritario = this.catObjetivosPrioritarioR;
    this.dataEstrategiaPrioritaria = this.catEstrategiaPrioritariaR;
    this.dataAccionPuntualPI = this.catAccionPuntualPIR;
  }

  getProjects({
    excluirCortoPlazo,
    priorizarProyectoAsociado,
    idSolicitud,
  }: {
    excluirCortoPlazo: boolean;
    priorizarProyectoAsociado: boolean;
    idSolicitud: number;
  }) {
    this.projectsService
      .getConsultarProyectos(
        this.yearNav,
        excluirCortoPlazo,
        idSolicitud,
        priorizarProyectoAsociado
      )
      .pipe(takeUntil(this.notifier))
      .subscribe((response) => {
        if (response.codigo === '200' && response.respuesta?.length) {
          if (!this.position) {
            this.dataProjects = response.respuesta.filter((item) => {
              if (this.dataUser.perfilLaboral.cveUnidad === item.claveUnidad) {
                if (this.whatModuleStart === 'proyects') {
                  if (item.estatus !== 'B' && item.estatus !== 'T') {
                    return true;
                  }
                } else {
                  if (item.estatus === 'O') {
                    return true;
                  }
                }
              }
              return false;
            });
          }
          if (this.position === 'left') {
            this.dataProjects = response.respuesta.filter(
              (item) =>
                item.estatus === 'O' &&
                this.dataUser.perfilLaboral.cveUnidad === item.claveUnidad
            );
            this.getConsultarActividadByIdAdecuacion();
          }
          this.questions[0].options = mapOptionProjects(this.dataProjects);
        } else {
          if (this.whatModuleStart === 'activities') {
            this.getProjects({
              excluirCortoPlazo: false,
              priorizarProyectoAsociado: false,
              idSolicitud: 0,
            });
          }
        }
      });
  }

  getConsultarActividadByIdAdecuacion() {
    this.activitiesFollowService
      .getActiModiByIdAdecuacionSolicitud(
        this.getIdAdecuancionModificacionActividades()
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: async (value) => {
          if (value.codigo === '200' && value.respuesta.length) {
            const tmpArray: any[] = [];
            for (const item of value.respuesta) {
              const findedProject = this.dataProjects.find(
                (itemFind) =>
                  itemFind.idProyecto === item.actividadReferencia.idProyecto
              );
              if (findedProject) {
                tmpArray.push({
                  ...item,
                  project: findedProject,
                  nombreActividad: item.actividadReferencia.cxNombreActividad,
                  cveProyecto: getCveProyecto({
                    cveUnidad: findedProject?.claveUnidad,
                    cveProyecto: findedProject ? +findedProject.clave : 0,
                  }),
                  cveActividad: getNumeroActividad(
                    item.actividadReferencia.cveActividad
                  ),
                  fullEstatus: getGlobalStatus(
                    item.actividadModificacion.csEstatus,
                    this.dataUser.idTipoUsuario
                  ),
                });
              } else {
                const projectFinded = await this.getProjectByIdPromise(
                  item.actividadReferencia.idProyecto
                );
                if (projectFinded) {
                  tmpArray.push({
                    ...item,
                    project: projectFinded,
                    nombreActividad: item.actividadReferencia.cxNombreActividad,
                    cveProyecto: getCveProyecto({
                      cveUnidad: projectFinded?.claveUnidad,
                      cveProyecto: projectFinded ? +projectFinded.clave : 0,
                    }),
                    cveActividad: getNumeroActividad(
                      item.actividadReferencia.cveActividad
                    ),
                    fullEstatus: getGlobalStatus(
                      item.actividadModificacion.csEstatus,
                      this.dataUser.idTipoUsuario
                    ),
                  });
                }
              }
            }
            this.dataModificacionTable = tmpArray;
          } else {
            this.dataModificacionTable = [];
          }
        },
      });
  }

  getProjectByIdPromise(
    idProyecto: number
  ): Promise<IItemConsultaProyectoPorIdResponse> {
    return new Promise<IItemConsultaProyectoPorIdResponse>(
      (resolve, reject) => {
        this.projectsService
          .getProjectById(idProyecto)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              if (value.codigo === '200' && value.respuesta) {
                resolve(value.respuesta);
              } else {
                reject(null);
              }
            },
            error: (err) => {
              reject(err);
            },
          });
      }
    );
  }

  getSecuencialActividad(projectSelected: IItemConsultarPRoyectosResponse) {
    this.activitiesFollowService
      .getSecuencialPorProyecto(projectSelected.idProyecto)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.form.get('claveActividad')?.setValue(
            `${getCveProyecto({
              cveUnidad: projectSelected.claveUnidad,
              cveProyecto: +projectSelected?.clave,
            })}-${getNumeroActividad(value.respuesta)}`
          );
        },
      });
  }

  getActivities(idProject: number) {
    let excluirCortoPlazo: boolean = false,
      idSolicitud: number = 0;
    if (
      this.whatModuleStart === 'proyects' ||
      this.whatModuleStart === 'activities'
    ) {
      excluirCortoPlazo = true;
      idSolicitud = this.selectedSolicitud.idSolicitud ?? 0;
    }
    this.activitiesFollowService
      .getActivityByProjectIdSolicitud(
        idProject,
        excluirCortoPlazo,
        idSolicitud
      )
      .pipe(takeUntil(this.notifier))
      .subscribe(async (response) => {
        this.data = [];
        const tmpData: IItemActivitiesResponse[] = [];
        if (response.codigo === '200' && response.respuesta?.length) {
          for (const item of response.respuesta) {
            if (item.csEstatus !== 'B') {
              tmpData.push({
                ...item,
                cveProyecto: getCveProyecto({
                  cveUnidad: this.projectSelected.claveUnidad,
                  cveProyecto: +this.projectSelected.clave,
                }),
                cveActividad: getNumeroActividad(item.cveActividad),
                csEstatus: getGlobalStatus(
                  item.csEstatus,
                  this.dataUser.idTipoUsuario
                ),
              });
            }
          }
          this.data = tmpData;
          if (this.position === 'left') {
            this.questions[3].options = this.data.map((item) => {
              return {
                id: item.idActividad,
                value: item.cxNombreActividad,
              };
            });
            this.form.get('nombreActividad')?.enable({ emitEvent: false });
          }
        }
      });
  }

  uploadDataToForm(dataAction: IItemActivitiesResponse) {
    let cveProyecto = getCveProyecto({
      cveUnidad: this.projectSelected.claveUnidad,
      cveProyecto: +this.projectSelected?.clave,
    });
    this.form.controls['claveProyecto'].setValue(cveProyecto, {
      emitEvent: false,
    });
    this.form.controls['claveActividad'].setValue(
      `${cveProyecto}-${getNumeroActividad(dataAction.cveActividad)}`,
      { emitEvent: false }
    );
    if (this.position !== 'left') {
      this.form.controls['nombreActividad'].setValue(
        dataAction.cxNombreActividad,
        { emitEvent: false }
      );
    }
    this.form.controls['descripcion'].setValue(dataAction.cxDescripcion, {
      emitEvent: false,
    });
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
      dataAction.cxArticulacionActividad,
      { emitEvent: false }
    );

    this.form.controls['actividadTrasversal'].setValue(
      dataAction.icActividadTransversal == 0 ? false : true,
      { emitEvent: false }
    );
    this.form.controls['reunionesRealizar'].setValue(
      dataAction.ixReunion == 0 ? null : true,
      { emitEvent: true }
    );

    this.form.controls['tema'].setValue(dataAction.cxTema, {
      emitEvent: false,
    });
    this.form.controls['alcance'].setValue(dataAction.idAlcance, {
      emitEvent: false,
    });
    this.form.controls['lugar'].setValue(dataAction.cxLugar, {
      emitEvent: false,
    });
    this.form.controls['actores'].setValue(dataAction.cxActores, {
      emitEvent: false,
    });
    const fechaTentativa: number[] = [];
    for (const item of dataAction.fechaTentativa) {
      fechaTentativa.push(item.idMes);
    }
    this.form.controls['fechatentativa'].setValue(fechaTentativa, {
      emitEvent: false,
    });
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

  getIdAdecuancionModificacionActividades(): number {
    return getIdAdecuancionSolicitud({
      selectedSolicitud: this.selectedSolicitud,
      tipoApartado: TIPO_APARTADO.actividades,
      tipoModificacion: MODIFICATION_TYPE.modificacion,
    });
  }

  newActivity() {
    this.resetAllForm();
    this.form.get('estrategiaPrioritaria')?.disable({ emitEvent: false });
    this.form.get('accionPuntual')?.disable({ emitEvent: false });
    this.disabledSubmiting = false;
    this.dataSelected = null;
    this.getSecuencialActividad(this.projectSelected);
  }

  resetAllForm() {
    if (this.position !== 'left') {
      this.form.enable({ emitEvent: false });
    }
    this.form.get('claveProyecto')?.disable({ emitEvent: false });
    this.form.get('claveActividad')?.disable({ emitEvent: false });
    this.form.get('tema')?.disable({ emitEvent: false });
    this.form.get('alcance')?.disable({ emitEvent: false });
    this.form.get('lugar')?.disable({ emitEvent: false });
    this.form.get('actores')?.disable({ emitEvent: false });
    this.form.get('fechatentativa')?.disable({ emitEvent: false });
    if (!this.position) {
      this.form.get('nombreActividad')?.setValue('', { emitEvent: false });
    }
    this.claveActividad = 0;
    this.form.patchValue(
      {
        descripcion: null,
        objetivoPrioritario: null,
        estrategiaPrioritaria: null,
        accionPuntual: null,
        artActividadesPresenteEjercicio: null,
        actividadTrasversal: null,
        reunionesRealizar: null,
        tema: null,
        alcance: null,
        lugar: null,
        actores: null,
        fechatentativa: null,
      },
      { emitEvent: false }
    );
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: IItemActivitiesResponse = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.resetAllForm();
        if (!this.position) {
          this.dataSelected = dataAction;
        }
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.form.disable({ emitEvent: false });
          this.disabledSubmiting = true;
          if (this.position === 'left') {
            this.form.get('nombreProyecto')?.enable({ emitEvent: false });
            this.form.get('nombreActividad')?.enable({ emitEvent: false });
          }
        }, 100);
        break;
      case TableConsts.actionButton.edit:
        this.resetAllForm();
        this.disabledSubmiting = false;
        if (!this.position) {
          this.dataSelected = dataAction;
        }
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          if (this.position === 'right') {
            this.form.get('nombreProyecto')?.disable({ emitEvent: false });
          }
          this.form.get('claveProyecto')?.disable({ emitEvent: false });
          this.form.get('claveActividad')?.disable({ emitEvent: false });
        }, 100);
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar la Actividad?',
          });
          if (confirm) {
            this.activitiesFollowService
              .deleteActivity(dataAction.idActividad, {
                id: dataAction.idActividad,
                usuario: this.dataUser.cveUsuario,
              })
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this._alertService.showAlert('Se Eliminó Correctamente');
                    this.getActivities(dataAction.idProyecto);
                    this.form.enable();
                    this.resetAllForm();
                  }
                },
                error: (err) => { },
              });
          }
        }
        break;
    }
  }

  async onTableModificacionesAction(event: TableButtonAction) {
    const dataAction: IItemActivitiesResponse = event.value.actividadReferencia;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.projectSelected = event.value.project;
        this.resetAllForm();
        setTimeout(() => {
          this.form
            .get('nombreProyecto')
            ?.setValue(event.value.project.idProyecto, {
              emitEvent: true,
            });
          this.uploadDataToForm(dataAction);
          this.form.disable({ emitEvent: false });
          this.form
            .get('nombreActividad')
            ?.setValue(event.value.actividadReferencia.idActividad, {
              emitEvent: false,
            });
          this.form.get('nombreProyecto')?.enable({ emitEvent: false });
          this.form.get('nombreActividad')?.enable({ emitEvent: false });

          this.pModMoveService.sendData({
            from: 'left',
            isNew: false,
            viewType: 'view',
            data: {
              selectedProject: event.value.project,
              selectedActivity: event.value.actividadReferencia,
              selectedActividadModification: event.value.actividadModificacion,
            },
          });
        }, 100);
        break;
      case TableConsts.actionButton.edit:
        this.projectSelected = event.value.project;
        this.resetAllForm();
        setTimeout(() => {
          this.form
            .get('nombreProyecto')
            ?.setValue(event.value.project.idProyecto, {
              emitEvent: true,
            });
          this.uploadDataToForm(dataAction);
          this.form
            .get('nombreActividad')
            ?.setValue(event.value.actividadReferencia.idActividad, {
              emitEvent: false,
            });
          this.form.get('claveProyecto')?.disable({ emitEvent: false });
          this.form.get('claveActividad')?.disable({ emitEvent: false });

          this.pModMoveService.sendData({
            from: 'left',
            isNew: false,
            viewType: 'edit',
            data: {
              selectedProject: event.value.project,
              selectedActivity: event.value.actividadReferencia,
              selectedActividadModification: event.value.actividadModificacion,
            },
          });
        }, 100);
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation({
            message:
              '¿Está Seguro de Eliminar la Modificación de la Actividad?',
          });
          if (confirm) {
            this.activitiesFollowService
              .deleteAdecuacion({
                idReferencia: dataAction.idActividad,
                idAdecuacionSolicitud:
                  this.getIdAdecuancionModificacionActividades(),
              })
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this._alertService.showAlert('Se Eliminó Correctamente');
                    this.getConsultarActividadByIdAdecuacion();
                    this.resetAllForm();
                    this.form.get('nombreProyecto')?.setValue('', {
                      emitEvent: false,
                    });
                    this.form.get('nombreActividad')?.disable({
                      emitEvent: false,
                    });
                    this.form.get('nombreActividad')?.setValue('', {
                      emitEvent: false,
                    });
                    this.questions[3].options = [];
                    this.pModMoveService.sendData({
                      from: 'left',
                      isNew: false,
                      viewType: 'view',
                      data: 'resetAllForm',
                    });
                  }
                },
                error: (err) => { },
              });
          }
        }
        break;
    }
  }

  get showBtnSave(): boolean {
    if (this.position) {
      if (this.position === 'right' && this.activitySelected && this.canEdit) {
        return true;
      } else {
        return false;
      }
    } else {
      return !this.modify && this.canEdit;
    }
  }

  ngOnDestroy(): void {
    this._body?.classList.remove('hideW');
    this.notifier.complete();
    this.pModMoveSubscription?.unsubscribe();
  }
}
