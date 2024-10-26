import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { Observable, Subject, forkJoin, takeUntil } from 'rxjs';
import { FormsStateService } from '../../services/forms-state.service.ts.service';
import { AlertService } from '@common/services/alert.service';
import { TblWidthService } from '@common/services/tbl-width.service';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { CatalogsService } from '@common/services/catalogs.service';
import { environment } from 'src/environments/environment';
import { IItemCatalogoResponse } from '@common/interfaces/catalog.interface';
import { TableColumn } from '@common/models/tableColumn';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import * as SecureLS from 'secure-ls';
import { AlfrescoService } from '@common/services/alfresco.service';
import { ProjectsService } from '../../../../../../common/services/projects.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { IItemProjectsResponse } from '@common/interfaces/projects.interface';
import { ModalService } from '@common/modal/modal.service';
import { RegisterDataService } from '@common/services/register-data.service';
import { StateViewService } from 'src/app/planning/short-term/services/state-view.service';
import { getCveProyecto, getGlobalStatus } from '@common/utils/Utils';
import { Router } from '@angular/router';
import { GoalsService } from '@common/services/goals.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnDestroy {
  ls = new SecureLS({ encodingType: 'aes' });
  @Output() setRecord: EventEmitter<any> = new EventEmitter<any>();
  data: IItemProjectsResponse[] = [];
  isCleanForm: boolean = false;
  columns: TableColumn[] = [
    {
      columnDef: 'claveNombreUnidad',
      header: 'Clave y Nombre de la Unidad',
      alignLeft: true,
    },
    {
      columnDef: 'claveProyecto',
      header: 'Clave del<br />Proyecto',
      width: '180px',
    },
    // REVIEW: ajustar nameP
    { columnDef: 'nombre', header: 'Nombre del Proyecto', alignLeft: true },
    { columnDef: 'estatusFull', header: 'Estatus', width: '120px' },
  ];
  actions: TableActionsI = {
    edit: true,
    delete: true,
    view: true,
    custom: [
      {
        id: 'viewPdf',
        name: 'Visualizar y Descargar Documento Analítico',
        icon: 'picture_as_pdf',
        color: 'primary',
      },
    ],
  };
  loading = true;

  notifier = new Subject();
  formUnchanged = true;
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  private _body = document.querySelector('body');

  dataPP: any[] = [];
  isUploadFile: boolean = false;
  dataUser: IDatosUsuario;
  yearNav: string;
  numSecuenciaProyectoanual: number = 0;
  catalogNombreUnidad: IItemCatalogoResponse[] = [];
  isSubmiting: boolean = false;
  disabledSubmiting: boolean = false;
  filesToUploadComponents: any[] = [];
  dataSelected: IItemProjectsResponse | undefined;
  year2Digits: string;
  validation = false;
  editable = true;
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
  canEdit: boolean = true;

  constructor(
    private _formBuilder: QuestionControlService,
    private _formsState: FormsStateService,
    private _alertService: AlertService,
    private _tblWidthService: TblWidthService,
    private catalogService: CatalogsService,
    private alfrescoService: AlfrescoService,
    private projectsService: ProjectsService,
    public modalService: ModalService,
    private registerDataService: RegisterDataService,
    private _stateView: StateViewService,
    private router: Router,
    private goalsService: GoalsService
  ) {
    this.canEdit = this.ls.get('canEdit');
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.selectedAjustesProyectoPAA = this.ls.get('selectedAjustesProyectoPAA');
    this.selectedConsultaProyectoPAA = this.ls.get(
      'selectedConsultaProyectoPAA'
    );
    this.year2Digits = this.yearNav.substring(2, 4);
    this.getAll();
    this._formsState.unactiveAll();
    this._body?.classList.add('hideW');
    this.createQuestions();
    if (!this.selectedConsultaProyectoPAA && !this.selectedAjustesProyectoPAA) {
      this.getSecuenciaByUnidad();
    }
  }

  getProjects() {
    this.projectsService
      .getProjectByAnnio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          let existComplete = false;
          if (value.mensaje.codigo === '200' && value.proyecto?.length > 0) {
            this.data = value.proyecto
              .filter((item) => item.estatus !== 'B')
              .map((item) => {
                return {
                  ...item,
                  claveNombreUnidad: `${item.claveUnidad} ${item.nombreUnidad}`,
                  estatusFull: getGlobalStatus(item.estatus),
                  claveProyecto: getCveProyecto({
                    cveUnidad: item.claveUnidad,
                    cveProyecto: +item.clave,
                  }),
                };
              });

            const validation = (item) => item.estatus === 'C';
            existComplete = this.data.some(validation);
            this.registerDataService.sendData({ projects: existComplete });
          } else {
            this.data = [];
          }
        },
        error: () => { },
      });
  }

  getProjectsConsulta() {
    this.projectsService
      .getProjectByAnnioParaValidar(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200' && value.proyecto?.length > 0) {
            this.data = value.proyecto
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
                  claveNombreUnidad: `${item.claveUnidad} ${item.nombreUnidad}`,
                  claveProyecto: getCveProyecto({
                    cveProyecto: +item.clave,
                    cveUnidad: item.claveUnidad,
                  }),
                  estatusFull: getGlobalStatus(item.estatus),
                };
              })
              .reverse();
          } else this.data = [];
        },
        error: (err) => {
          this.data = [];
        },
      });
  }

  showActionIf = (action: string, value: any): boolean => {
    switch (value.estatus) {
      case 'P':
      case 'E':
        if (action === 'edit') return !!this.selectedAjustesProyectoPAA;
        if (action === 'delete') return !!this.selectedAjustesProyectoPAA;
        break;
      case 'T':
        if (action === 'edit') return false;
        break;
      case 'R':
        if (action === 'edit') return !!this.selectedAjustesProyectoPAA;
        break;
      case 'O':
        if (action === 'edit') return false;
        if (action === 'delete') return false;
        break;
      case 'V':
        if (
          (value.estatusPlaneacion === 'R' &&
            value.estatusPresupuesto === 'V') ||
          (value.estatusPlaneacion === 'V' && value.estatusPresupuesto === 'R')
        ) {
          return !!this.selectedAjustesProyectoPAA;
        } else {
          if (action === 'edit') return false;
          if (action === 'delete') return false;
        }
        break;
      case 'C':
        if (
          (value.estatusPlaneacion === 'R' &&
            value.estatusPresupuesto === 'R') ||
          (value.estatusPlaneacion === 'V' &&
            value.estatusPresupuesto === 'R') ||
          (value.estatusPlaneacion === 'R' &&
            value.estatusPresupuesto === 'V') ||
          (value.estatusPlaneacion === 'V' &&
            value.estatusPresupuesto === 'V' &&
            value.estatusSupervisor === 'R')
        ) {
          if (action === 'edit') return true;
          if (action === 'delete') return true;
        } else if (
          value.estatusPlaneacion === 'R' ||
          value.estatusPresupuesto === 'R' ||
          value.estatusSupervisor === 'R'
        ) {
          if (action === 'edit') return false;
          if (action === 'delete') return false;
        }
        break;
    }
    return true;
  };

  getProjectsById() {
    if (this.selectedAjustesProyectoPAA)
      this.projectsService
        .getProjectById(this.selectedAjustesProyectoPAA.value.idProyecto)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            if (value.mensaje.codigo === '200') {
              this.data = value.proyecto.map((item) => {
                return {
                  ...item,
                  claveNombreUnidad: `${item.claveUnidad} ${item.nombreUnidad}`,
                  estatusFull: getGlobalStatus(item.estatus),
                  claveProyecto: getCveProyecto({
                    cveUnidad: item.claveUnidad,
                    cveProyecto: +item.clave,
                  }),
                };
              });
              this.ls.set('selectedAjustesProyectoPAA', {
                name: 'view',
                value: this.data[0],
              });
            }
          },
          error: (err) => { },
        });
  }

  getSecuenciaByUnidad() {
    if (this.dataUser.perfilLaboral?.idCatalogoUnidad) {
      this.projectsService
        .getSecuenciaProyectoAnual(
          this.yearNav,
          String(this.dataUser.perfilLaboral.idCatalogoUnidad)
        )
        .pipe(takeUntil(this.notifier))
        .subscribe((response) => {
          this.numSecuenciaProyectoanual = response.respuesta;
          this.form.controls['clave'].setValue(
            getCveProyecto({ cveProyecto: this.numSecuenciaProyectoanual })
          );
        });
    }
  }

  validateWhereComeFrom() {
    const selectedUploadMasiveProyectoPAA = this.ls.get(
      'selectedUploadMasiveProyectoPAA'
    );
    if (selectedUploadMasiveProyectoPAA) {
      this.onTableAction(selectedUploadMasiveProyectoPAA);
    }
    if (this.selectedAjustesProyectoPAA) {
      this.onTableAction(this.selectedAjustesProyectoPAA);
      this.idSaveValidar = this.selectedAjustesProyectoPAA.value.idProyecto;
    }

    this.selectedValidateProyectoPAA = this.ls.get(
      'selectedValidateProyectoPAA'
    );
    if (this.selectedValidateProyectoPAA) {
      this.onTableAction(this.selectedValidateProyectoPAA);
      this.idSaveValidar = this.selectedValidateProyectoPAA.value.idProyecto;
    }
  }

  createQuestions() {
    const questions: any = [];

    questions.push(
      new TextboxQuestion({
        idElement: 80,
        nane: 'name',
        disabled: true,
        label: 'Clave y Nombre de la Unidad',
        value: `${this.dataUser.perfilLaboral.cveUnidad} ${this.dataUser.perfilLaboral.cdNombreUnidad}`,
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        idElement: 81,
        nane: 'clave',
        disabled: true,
        value: `${this.year2Digits}00`,
        label: 'Clave del Proyecto',
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextareaQuestion({
        idElement: 82,
        nane: 'nameProject',
        label: 'Nombre del Proyecto',
        rows: 2,
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    questions.push(
      new TextareaQuestion({
        idElement: 83,
        nane: 'objPrioritario',
        label: 'Objetivo',
        rows: 3,
        validators: [Validators.required, Validators.maxLength(400)],
      })
    );

    questions.push(
      new TextareaQuestion({
        idElement: 84,
        nane: 'fundamentacion',
        label: 'Fundamentación',
        validators: [Validators.required, Validators.maxLength(2000)],
      })
    );

    questions.push(
      new TextareaQuestion({
        idElement: 85,
        nane: 'alcance',
        label: 'Alcance',
        validators: [Validators.required, Validators.maxLength(2000)],
      })
    );

    questions.push(
      new DropdownQuestion({
        idElement: 86,
        nane: 'contribucionObjetivoPrioritarioPI',
        label: 'Contribución al Objetivo Prioritario de PI',
        filter: true,
        multiple: true,
        options: [],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        idElement: 87,
        nane: 'contribucionProgramasEspecialesDerivadosPND',
        label: 'Contribución a Programas Especiales Derivados del PND',
        options: [],
        filter: true,
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        idElement: 88,
        nane: 'PNCCIMGP',
        label: 'Contribución al PNCCIMGP',
        options: [],
        filter: true,
        multiple: true,
        validators: [Validators.required],
      })
    );

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.valueChanges.pipe(takeUntil(this.notifier)).subscribe(() => {
      this.formUnchanged = false;
    });
    if (!this._stateView.editable) {
      this.form.disable();
      this.actions = {
        view: true,
        custom: [
          {
            id: 'viewPdf',
            name: 'Visualizar y Descargar Documento Analítico',
            icon: 'picture_as_pdf',
            color: 'primary',
          },
        ],
      };
    }

    if (this.selectedAjustesProyectoPAA) {
      this.validation = true;
      this.disabledAppValidate = true;
    } else {
      this.validation = this._stateView.validation;
    }

    if (this.selectedConsultaProyectoPAA) {
      this.onTableAction(this.selectedConsultaProyectoPAA);
    }
  }

  get getQuestions() {
    return [
      new DropdownQuestion({
        idElement: 80,
        nane: 'name',
        value: '',
        label: 'Comentarios',
        filter: true,
        options: [],
        validators: [Validators.required],
      }),
    ];
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

  async submit() {
    const formBody = this.form.getRawValue();

    if (!this.filesToUploadComponents.length) {
      this._alertService.showAlert('El documento analítico es requerido.');
      return;
    }

    if (this.form.valid) {
      this.isSubmiting = true;
      let claveUnidad = this.dataUser.perfilLaboral.cveUnidad;
      let nombreUnidad = this.dataUser.perfilLaboral.cdNombreUnidad;
      let contribucionObjetivo: any[] = [];
      for (const item of formBody.contribucionObjetivoPrioritarioPI) {
        contribucionObjetivo.push({
          idCatalogo: item,
        });
      }
      let contribucionPNCCIMGP: any[] = [];
      for (const item of formBody.PNCCIMGP) {
        contribucionPNCCIMGP.push({
          idCatalogo: item,
        });
      }
      if (!this.dataSelected) {
        let archivoToCreate: any = null;
        if (this.filesToUploadComponents?.length > 0) {
          const responseAlf = await this.uploadToAlfresco(
            this.filesToUploadComponents
          );
          if (responseAlf) {
            archivoToCreate = [responseAlf];
          }
        }

        const dataCreateProyecto = {
          idAnhio: +this.yearNav,
          cveProyecto: this.numSecuenciaProyectoanual,
          nombreProyecto: formBody.nameProject,
          claveUnidad,
          nombreUnidad,
          objetivo: formBody.objPrioritario,
          csEstatus: this.form.valid ? 'C' : 'I',
          fundamentacion: formBody.fundamentacion,
          alcance: formBody.alcance,
          contribucionProgramaEspecial:
            formBody.contribucionProgramasEspecialesDerivadosPND === '0'
              ? null
              : formBody.contribucionProgramasEspecialesDerivadosPND,
          contribucionObjetivo,
          contribucionPNCCIMGP,
          archivos: archivoToCreate,
          cveUsuario: this.dataUser.cveUsuario,
        };
        this.projectsService
          .createProject(dataCreateProyecto)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmiting = false;
              if (value.mensaje.codigo === '200') {
                let inpFile: any = document.getElementById(
                  'file-documento-analitico'
                );
                inpFile.value = '';
                this.getProjectsSwitch();
                this.newProyect();
                this.dataSelected = undefined;
                this._alertService.showAlert('Se Guardó Correctamente');
              } else if (value.mensaje.codigo === '202') {
                this._alertService.showAlert(value.mensaje.mensaje);
              }
            },
            error: (error) => {
              this.isSubmiting = false;
            },
          });
      } else {
        let archivoToUpdate: any = null;
        if (
          this.dataSelected.archivos?.[0].uuid !==
          this.filesToUploadComponents?.[0].uuid
        ) {
          const responseAlf = await this.uploadToAlfresco(
            this.filesToUploadComponents
          );
          if (responseAlf) {
            archivoToUpdate = responseAlf;
          }
        }

        const dataUpdateProyecto = {
          idAnhio: +this.yearNav,
          cxNombreProyecto: formBody.nameProject,
          cxObjetivo: formBody.objPrioritario,
          cveUsuario: this.dataUser.cveUsuario,
          csEstatus: this.form.valid ? 'COMPLETO' : 'INCOMPLETO',
          contribucionProgramaEspecial:
            formBody.contribucionProgramasEspecialesDerivadosPND === '0'
              ? null
              : formBody.contribucionProgramasEspecialesDerivadosPND,
          contribucionObjetivo,
          contribucionPNCCIMGP,
          archivo: archivoToUpdate,
          cxNombreUnidad: nombreUnidad,
          cveUnidad: claveUnidad,
          cxAlcance: formBody.alcance,
          cxFundamentacion: formBody.fundamentacion,
          cveProyecto: this.dataSelected.clave,
        };

        this.projectsService
          .updateProject(
            String(this.dataSelected?.idProyecto),
            dataUpdateProyecto
          )
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmiting = false;
              if (value.mensaje.codigo === '200') {
                this.getProjectsSwitch();
                if (!this.selectedAjustesProyectoPAA) {
                  this.newProyect();
                  this.dataSelected = undefined;
                }
                this._alertService.showAlert('Se Modificó Correctamente');
              } else if (value.mensaje.codigo === '202') {
                this._alertService.showAlert(value.mensaje.mensaje);
              }
            },
            error: (error) => {
              this.isSubmiting = false;
            },
          });
      }
    }
  }

  async getAll(): Promise<void> {
    this.loading = true;
    this.getCatalogs();
    this.getProjectsSwitch();
    this.loading = false;
  }

  getProjectsSwitch() {
    if (this.selectedAjustesProyectoPAA) {
      this.getProjectsById();
    } else if (this.selectedConsultaProyectoPAA) {
      this.getProjectsConsulta();
    } else {
      this.getProjectsConsulta();
    }
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['unidadAdministrativa']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['contribucionProgramasEspeciales']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['contribucionPNCCIMGP']
      ),
      this.goalsService.getCatalogObjetivo(this.yearNav),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(
        ([
          dataClaveNombreUnidadResponsable,
          dataContribucionProgramasEspeciales,
          dataContribucionPNCCIMGP,
          dataObjetivosPrioritarioAnhio,
        ]) => {
          this.catalogNombreUnidad = dataClaveNombreUnidadResponsable.catalogo;
          this.questions[0].options = mapCatalogData({
            data: dataClaveNombreUnidadResponsable,
          });
          //COMMENT: Objetivo Prioritario de PI
          const getCustomNameObjeto = (item: IItemCatalogoResponse): string =>
            `${item.ccExterna}. ${item.cdOpcion}`;
          this.questions[6].options = mapCatalogData({
            data: dataObjetivosPrioritarioAnhio,
            withIdx: false,
            withOrder: true,
            keyForOrder: 'ccExterna',
            getCustomValue: getCustomNameObjeto,
          });
          this.questions[7].options = mapCatalogData({
            data: dataContribucionProgramasEspeciales,
            withOptionNoAplica: true,
          }); //COMMENT: Contribución a Programas especiales derivados del PND
          this.questions[8].options = mapCatalogData({
            data: dataContribucionPNCCIMGP,
          }); //COMMENT: Contribución al PNCCIMGP
          this.validateWhereComeFrom();
        }
      );
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: IItemProjectsResponse = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this._formsState.setReadonly(true);
        this._formsState.setProduct(event.value);
        this.dataSelected = dataAction;
        this.resetAllForm();
        this.isCleanForm = true;
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.form.disable();
          this.disabledSubmiting = true;
        }, 100);
        break;
      case TableConsts.actionButton.edit:
        this._formsState.setReadonly(false);
        this._formsState.setProduct(event.value);
        this.dataSelected = dataAction;
        this.resetAllForm();
        this.isCleanForm = true;
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.form.enable();
          this.form.get('name')?.disable();
          this.form.get('clave')?.disable();
          this.disabledSubmiting = false;
        }, 100);
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar el Proyecto?',
          });
          if (confirm) {
            this.projectsService
              .deleteProject({
                id: dataAction.idProyecto,
                usuario: this.dataUser.cveUsuario,
              })
              .pipe(takeUntil(this.notifier))
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this._alertService.showAlert('Se Eliminó Correctamente');
                    if (this.selectedAjustesProyectoPAA) {
                      this.ls.remove('selectedAjustesProyectoPAA');
                      this.router.navigate([
                        '/Planeación/Planeación a Corto Plazo/Ajustes',
                      ]);
                    } else {
                      this.getProjectsSwitch();
                      this.newProyect();
                    }
                  }
                },
                error: (err) => { },
              });
          }
        }
        break;
      case 'viewPdf':
        if (dataAction.archivos[0].uuidToPdf) {
          this.modalService.openGenericModal({
            idModal: 'modal-disabled',
            component: 'viewerPdf',
            data: {
              title: 'Visualización del documento analítico ',
              sourceFromAlfresco: dataAction.archivos[0].uuidToPdf,
              propertiesViewerPdf: '#toolbar=0&navpanes=0&scrollbar=0',
              sourceType: 'resourceUrl',
              downloadFile: {
                type: 'alfresco',
                uuidFile: dataAction.archivos[0].uuid,
                name: dataAction.archivos[0].nombre,
              },
            },
          });
        } else {
          this._alertService.showAlert(
            'Ocurrió un error al convertir el archivo, por favor revise que no esté dañado o no sea un documento vacío.'
          );
        }
        break;
    }
  }

  uploadDataToForm(dataAction: IItemProjectsResponse) {
    this.form.controls['name'].setValue(
      `${dataAction.claveUnidad} ${dataAction.nombreUnidad}`
    );
    this.form.controls['clave'].setValue(
      getCveProyecto({
        cveProyecto: +dataAction.clave,
        cveUnidad: dataAction.claveUnidad,
      })
    );
    this.form.controls['nameProject'].setValue(dataAction.nombre);
    this.form.controls['objPrioritario'].setValue(dataAction.objetivo);
    this.form.controls['fundamentacion'].setValue(dataAction.fundamentacion);
    this.form.controls['alcance'].setValue(dataAction.alcance);
    this.form.controls['contribucionProgramasEspecialesDerivadosPND'].setValue(
      dataAction.contribucionProgramaEspecial ?? '0'
    );

    const contribucionObjetivoPrioritarioPI: number[] = [];
    if (dataAction.contribucionObjetivoPrioritarioPI?.length) {
      for (const item of dataAction.contribucionObjetivoPrioritarioPI) {
        contribucionObjetivoPrioritarioPI.push(item.idCatalogo);
      }
    }
    this.form.controls['contribucionObjetivoPrioritarioPI'].setValue(
      contribucionObjetivoPrioritarioPI
    );

    const PNCCIMGP: number[] = [];
    if (dataAction.contribucionPNCCIMGP?.length) {
      for (const item of dataAction.contribucionPNCCIMGP) {
        PNCCIMGP.push(item.idCatalogo);
      }
    }
    this.form.controls['PNCCIMGP'].setValue(PNCCIMGP);
    const dataFile = {
      ...dataAction.archivos[0],
      name: dataAction.archivos[0].nombre,
    };
    this.filesToUploadComponents = [dataFile];
  }

  uploadToAlfresco(files: any[]) {
    return new Promise<any>((resolve, reject) => {
      const dataAlf: ISeguridadAlfResponse = this.ls.get('dataAlf');
      let fileTmp: any = null;
      if (files.length > 0) {
        this.isUploadFile = true;
        fileTmp = files[0];
        this.alfrescoService
          .uploadFileAlfService(dataAlf.uuidPlaneacion, fileTmp)
          .subscribe({
            next: (value) => {
              this.isUploadFile = false;
              resolve({
                idArchivo: null,
                estatus: 'A',
                nombre: fileTmp.name,
                usuario: this.dataUser.cveUsuario,
                uuid: value.entry.id,
              });
            },
            error: (err) => {
              this.isUploadFile = false;
              reject(err);
            },
          });
      }
    });
  }

  responseFileUpload(files: any[]) {
    this.filesToUploadComponents = files;
  }

  newProyect() {
    this.resetAllForm();
    this.getSecuenciaByUnidad();
    this.form.enable();
    this.form.get('clave')?.disable();
    this.form.get('name')?.disable();
    this.dataSelected = undefined;
    this.isCleanForm = false;
  }

  resetAllForm() {
    this.form.reset();
    this.disabledSubmiting = false;
    this.filesToUploadComponents = [];
    this.form
      .get('name')
      ?.setValue(
        `${this.dataUser.perfilLaboral.cveUnidad} ${this.dataUser.perfilLaboral.cdNombreUnidad}`
      );
  }

  get showBtnSave(): boolean {
    if (this.selectedAjustesProyectoPAA) {
      return true;
    } else {
      return (
        !this.dataSelected ||
        this.dataSelected?.estatus === 'I' ||
        this.dataSelected?.estatus === 'C'
      );
    }
  }
}
