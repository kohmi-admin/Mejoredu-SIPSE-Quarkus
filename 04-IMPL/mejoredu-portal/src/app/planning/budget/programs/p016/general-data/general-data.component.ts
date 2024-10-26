import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { StateService } from '../../services/state.service';
import { ModalService } from '@common/modal/modal.service';
import * as SecureLS from 'secure-ls';
import { Subject, forkJoin, take, takeUntil } from 'rxjs';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { environment } from 'src/environments/environment';
import { CatalogsService } from '@common/services/catalogs.service';
import {
  IItemP016DataGeneralResponse,
  IP016DataGeneralPayload,
} from '@common/interfaces/budget/p016/data-general.interface';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { P016DataGeneralService } from '@common/services/budget/p016/data-general.service';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { AlfrescoService } from '@common/services/alfresco.service';
import { GlobalFunctionsService } from '@common/services/global-functions.service';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { NumberQuestion } from '@common/form/classes/question-number.class';
import { StateViewService } from '../../../services/state-view.service';
import { ReportBuilderComponent } from '@common/report-builder/report-builder.component';
import { DOCUMENT_TYPES } from '@common/enums/documentTypes.enum';
import { AlertService } from '@common/services/alert.service';

@Component({
  selector: 'app-general-data',
  templateUrl: './general-data.component.html',
  styleUrls: ['./general-data.component.scss'],
})
export class GeneralDataComponent implements OnInit {
  @Input() canNavigate = true;
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  viewType: 'registro' | 'consulta' | 'actualizacion' = 'registro';

  ls = new SecureLS({ encodingType: 'aes' });
  notifier = new Subject();
  loading: boolean = false;
  dataUser: IDatosUsuario;
  dataAlf: ISeguridadAlfResponse;
  yearNav: string = '';
  filesArchivos: any[] = [];
  arrayFiles: any[] = [];
  isSubmiting: boolean = false;
  editable = true;
  validation = false;
  consulting = false;
  idSaveValidar: number = 0;
  statusGeneralFichaP016!: string;
  canEdit: boolean = true;
  selectedAjustesPP!: any;
  selectedValidarPP!: any;
  columns = [
    { columnDef: 'program', header: 'Nombre del Documento' },
    { columnDef: 'registerDate', header: 'Fecha de Carga' },
  ];
  actions: TableActionsI = {
    delete: false,
    custom: [
      {
        id: 'download',
        name: 'Descargar',
        icon: 'download',
        color: 'primary',
      },
    ],
  };

  constructor(
    private _formBuilder: QuestionControlService,
    private _stateService: StateService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private catalogService: CatalogsService,
    private p016DataGeneralService: P016DataGeneralService,
    public modalService: ModalService,
    private alfrescoService: AlfrescoService,
    private globalFuntions: GlobalFunctionsService,
    private _stateViewService: StateViewService
  ) {
    this.yearNav = this.ls.get('yearNav');
    this.dataUser = this.ls.get('dUaStEaR');
    this.canEdit = this.ls.get('canEdit');
    this.dataAlf = this.ls.get('dataAlf');
    this.editable = this._stateViewService.editable;
    this.validation = this._stateViewService.validation;
    this.consulting = this._stateViewService.consulting;
    this.selectedAjustesPP = this.ls.get('selectedAjustesPP');
    this.selectedValidarPP = this.ls.get('selectedValidarPP');
    if (this.canEdit && this.selectedValidarPP) {
      this.canEdit = false;
    }
    this.createQuestions();
    this.getAll();
    this.getDatosGeneralesPorAnhio();
  }

  ngOnInit(): void {
    this.form.disable();
  }

  getDatosGeneralesPorAnhio() {
    this.p016DataGeneralService
      .getDataGeneralPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            this.idSaveValidar = value.respuesta.idDatosGenerales;
            this.statusGeneralFichaP016 = value.respuesta.estatusGeneral;
            if (
              !this.selectedAjustesPP &&
              !this.selectedValidarPP &&
              !this.consulting &&
              (this.statusGeneralFichaP016 === 'P' ||
                this.statusGeneralFichaP016 === 'E')
            ) {
              this.alertService.showAlert(
                'El programa está en Proceso de Validación, para Modificarla Vaya a Ajustes.'
              );
            }
            this.uploadDataForm(value.respuesta);
            if (value?.respuesta?.archivos?.length > 0) {
              const tmpFiles: any[] = [];
              for (const item of value.respuesta.archivos) {
                tmpFiles.push({
                  ...item,
                  program: item.cxNombre,
                  registerDate: item.dfFechaCarga,
                });
              }
              this.filesArchivos = tmpFiles;
            }
          }
        },
        error: (err) => { },
      });
  }

  createQuestions() {
    const disabled = !this._stateService.getCanEdit();

    this.questions = [
      new TextboxQuestion({
        idElement: 139,
        nane: 'nombreProgramaPresupuestario',
        disabled: true,
        label: 'Nombre del Programa Presupuestario',
        value:
          'Planeación, diseño, ejecución y evaluación del Sistema Nacional de Mejora Continua de la Educación.',
        validators: [Validators.maxLength(100)],
      }),

      new DropdownQuestion({
        idElement: 140,
        nane: 'ramosSector',
        label: 'Ramos y/o Sector',
        disabled,
        filter: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new DropdownQuestion({
        idElement: 141,
        nane: 'unidadResponsable',
        label: 'Unidad Responsable',
        filter: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new NumberQuestion({
        idElement: 142,
        nane: 'anhioRegistro',
        label: 'Año de Registro',
        disabled: true,
      }),

      new TextareaQuestion({
        idElement: 143,
        nane: 'finalidad',
        label: 'Finalidad',
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextareaQuestion({
        idElement: 144,
        nane: 'funcion',
        label: 'Función',
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextboxQuestion({
        idElement: 145,
        nane: 'actividadInstitucional',
        label: 'Actividad Institucional',
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextareaQuestion({
        idElement: 146,
        nane: 'subfuncion',
        label: 'Subfunción',
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new DropdownQuestion({
        idElement: 147,
        nane: 'vinculacionODS',
        label: 'Vinculación con los ODS',
        disabled,
        filter: true,
        options: [],
        validators: [Validators.required, Validators.maxLength(100)],
      }),
    ];

    this.form = this._formBuilder.toFormGroup(this.questions);
    if (!this.editable) {
      this.form.disable();
    }
    this.form.get('anhioRegistro')?.setValue(this.yearNav);
  }

  getAll() {
    this.loading = true;
    this.getCatalogs();
    this.loading = false;
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['sector']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['unidadAdministrativa']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['objetivosDesarrolloSustentable']
      ),
    ])
      .pipe(take(1))
      .subscribe(([dataSector, dataUnidadResponsable, dataODS]) => {
        this.questions[1].options = mapCatalogData({
          data: dataSector,
        });
        this.questions[2].options = mapCatalogData({
          data: dataUnidadResponsable,
        });
        this.questions[8].options = mapCatalogData({
          data: dataODS,
        });
      });
  }

  async submit() {
    this.isSubmiting = true;
    const arrToFiles: any[] = [];
    if (this.filesArchivos?.length > 0) {
      for (const item of this.filesArchivos) {
        if (item.cxUuid) {
          arrToFiles.push({
            uuid: item.cxUuid,
          });
        } else {
          await this.alfrescoService
            .uploadFileToAlfrescoPromise(this.dataAlf.uuidPlaneacion, item.file)
            .then((uuid) => {
              arrToFiles.push({
                uuid,
                tipoArchivo: item.file.name.includes('.pdf')
                  ? DOCUMENT_TYPES.document
                  : DOCUMENT_TYPES.image,
                nombre: item.file.name,
              });
            })
            .catch((err) => { });
        }
      }
    }

    const {
      nombreProgramaPresupuestario,
      ramosSector,
      unidadResponsable,
      anhioRegistro,
      finalidad,
      funcion,
      actividadInstitucional,
      subfuncion,
      vinculacionODS,
    } = this.form.getRawValue();
    const p016DataGeneral: IP016DataGeneralPayload = {
      nombreProgramaPresupuestal: nombreProgramaPresupuestario,
      cveUsuario: this.dataUser.cveUsuario,
      archivos: arrToFiles,
      idRamo: ramosSector,
      idUnidadResponsable: unidadResponsable,
      anho: anhioRegistro,
      finalidad,
      funcion,
      subfuncion,
      actividadInstitucional,
      idVinculacionODS: vinculacionODS,
    };
    this.p016DataGeneralService
      .createDataGeneral(p016DataGeneral)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.isSubmiting = false;
          if (value.mensaje.codigo === '200') {
            this.getDatosGeneralesPorAnhio();
            this.form.disable();
            this.actions.delete = false;
            this.modalService.openGenericModal({
              idModal: 'modal-disabled',
              component: 'generic',
              data: {
                text: 'Se guardó correctamente.',
                labelBtnPrimary: 'Aceptar',
              },
            });
          }
        },
        error: (error) => {
          this.isSubmiting = false;
        },
      });
  }

  async onTableActionArchivos(event: TableButtonAction) {
    switch (event.name) {
      case 'download':
        if (event.value?.cxUuid) {
          this.downloadFileAlf(event.value?.cxUuid, event.value?.cxNombre);
        } else {
          this.globalFuntions.downloadInputFile(event.value.file);
        }
        break;
      case TableConsts.actionButton.delete:
        {
          const index = this.filesArchivos.findIndex(
            (item: any) => item.idCarga === event.value.idCarga
          );
          const tmpData = [...this.filesArchivos];
          tmpData.splice(index, 1);
          this.filesArchivos = tmpData;
        }
        break;
    }
  }

  handleAddFile() {
    const tmpFiles: any[] = [...this.filesArchivos];
    tmpFiles.push({
      program: this.arrayFiles[0].name,
      file: this.arrayFiles[0],
    });
    this.filesArchivos = tmpFiles;
    this.arrayFiles = [];
  }

  downloadFileAlf(uid: string, fileName: string) {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid,
      fileName,
    });
  }

  uploadDataForm(data: IItemP016DataGeneralResponse) {
    this.form.get('ramosSector')?.setValue(data.idRamo);
    this.form.get('unidadResponsable')?.setValue(data.idUnidadResponsable);
    this.form.get('anhioRegistro')?.setValue(data.anho);
    this.form.get('finalidad')?.setValue(data.finalidad);
    this.form.get('funcion')?.setValue(data.funcion);
    this.form
      .get('actividadInstitucional')
      ?.setValue(data.actividadInstitucional);
    this.form.get('subfuncion')?.setValue(data.subfuncion);
    this.form.get('vinculacionODS')?.setValue(data.idVinculacionODS);
  }

  download() {
    const questions: QuestionBase<any>[] = this.questions.map((item) => {
      item.value = this.form.get(item.nane)?.value;
      return item;
    });
    this.dialog.open(ReportBuilderComponent, {
      data: {
        questions,
        reportName: 'Datos Generales',
      },
      width: '1000px',
    });
  }

  update() {
    this.form.enable();
    this.form.get('anhioRegistro')?.disable();
    this.form.get('nombreProgramaPresupuestario')?.disable();
    this.actions.delete = true;
  }

  get disabledBtnEdit(): boolean {
    if (
      this.statusGeneralFichaP016 === 'T' ||
      this.statusGeneralFichaP016 === 'P' ||
      this.statusGeneralFichaP016 === 'E'
    ) {
      return true;
    } else {
      return this.form.enabled;
    }
  }

  ngOnDestroy() {
    this.notifier.complete();
  }
}
