import { Component } from '@angular/core';
import { CommonStructure } from '../classes/common-structure.class';
import { TableColumn } from '@common/models/tableColumn';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { Validators } from '@angular/forms';
import { StateViewService } from '../../../services/state-view.service';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { EpilogoPiActasService } from '@common/services/epilogoPiActas.service';
import { Subject, takeUntil } from 'rxjs';
import { PrincipalService } from '@common/services/medium-term/principal.service';
import * as SecureLS from 'secure-ls';
import {
  IArrFilesResponse,
  IEpilogoPayload,
} from '@common/interfaces/epilogo.interface';
import { IGestorResponse } from '@common/interfaces/medium-term/principal.interface';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { AlfrescoService } from '@common/services/alfresco.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { ModalService } from '@common/modal/modal.service';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableConsts } from '@common/mat-custom-table/consts/table';
import { AlertService } from '@common/services/alert.service';
import { Router } from '@angular/router';
import { downloadInputFile } from '@common/utils/Utils';
import { MatDialog } from '@angular/material/dialog';
import { ReportBuilderComponent } from '@common/report-builder/report-builder.component';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';

@Component({
  selector: 'app-epilogue',
  templateUrl: './epilogue.component.html',
  styleUrls: ['./epilogue.component.scss', '../structure.component.scss'],
})
export class EpilogueComponent extends CommonStructure {
  ls = new SecureLS({ encodingType: 'aes' });
  override columns: TableColumn[] = [
    { columnDef: 'name', header: 'Objetivos Prioritarios', alignLeft: true },
    {
      columnDef: 'Estrategia',
      header: 'Estrategia Prioritaria',
      alignLeft: true,
    },
    { columnDef: 'Acción', header: 'Acción Puntual', alignLeft: true },
  ];
  notifier = new Subject();
  dataUser: IDatosUsuario;
  yearNav: string = '';
  gestorSelected: null | IGestorResponse = null;
  filesActas: IArrFilesResponse[] | any[] = [];
  filesArchivosPi: IArrFilesResponse[] | any[] = [];
  isSubmiting: boolean = false;
  isSubmitingFinalize: boolean = false;
  idSaveValidar: number = 0;
  selectedValidatePI: any = null;
  selectedAjustesPI: any = null;
  viewType: 'registro' | 'consulta' | 'actualizacion' | 'validar' = 'registro';
  canEdit: boolean = true;
  generalReport: any = {};

  constructor(
    private _formBuilder: QuestionControlService,
    private _stateViewService: StateViewService,
    private epilogoService: EpilogoPiActasService,
    private principalService: PrincipalService,
    private alfrescoService: AlfrescoService,
    private modalService: ModalService,
    private alertService: AlertService,
    private router: Router,
    public dialog: MatDialog
  ) {
    super();
    this.selectedValidatePI = this.ls.get('selectedValidatePI');
    this.selectedAjustesPI = this.ls.get('selectedAjustesPI');
    this.canEdit = this.ls.get('canEdit');
    this.viewType = this.ls.get('recordViewType');
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.questions = [
      new TextareaQuestion({
        idElement: 75,
        nane: 'epilogo',
        label: 'Epílogo: Visión a Largo Plazo',
        icon: 'help',
        message: 'Alfanumérico, 3400 Caracteres de Longitud',
        validators: [Validators.required, Validators.maxLength(3400)],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    if (!this._stateViewService.editable) {
      this.form.disable();
      this.actions = undefined;
      this.editable = false;
    }
    if (this.viewType === 'validar') {
      this.editable = false;
    }
    if (!this.canEdit) {
      this.form.disable();
      this.editable = false;
      this.actions = {
        view: true,
      };
    }
    this.validation = this._stateViewService.validation;
    this.getGestorPorAnhio();
    this.getGeneralReport();
  }

  getGestorPorAnhio() {
    this.principalService
      .getGestorPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            if (value.respuesta.estatus === 'O') {
              this.canEdit = false;
              this.editable = false;
              this.form.disable({ emitEvent: false });
              this.alertService.showAlert('La Estructura está Aprobada.');
            } else if (
              this.canEdit &&
              value.respuesta.estatus !== 'C' &&
              value.respuesta.estatus !== 'I' &&
              !this.selectedValidatePI &&
              !this.selectedAjustesPI
            ) {
              this.canEdit = false;
              this.editable = false;
              this.form.disable({ emitEvent: false });
              if (value.respuesta.estatus !== 'T') {
                this.alertService.showAlert(
                  'La Estructura está en Proceso de Validación, para Modificarla Vaya a Ajustes.'
                );
              }
            }
            this.gestorSelected = value.respuesta;
            this.getEpilogoByIdEstructura();
          }
        },
      });
  }

  getEpilogoByIdEstructura() {
    this.epilogoService
      .getEpilogoPorIdEstructura(String(this.gestorSelected?.idPrograma))
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            if (
              this.viewType === 'validar' ||
              this.viewType === 'actualizacion'
            ) {
              this.validateWhereComeFrom(value.respuesta.idEpilogo);
            }
            this.form.get('epilogo')?.setValue(value.respuesta.descripcion);
            const tmpFilesPi: any[] = [];
            for (const item of value.respuesta.archivosPI) {
              tmpFilesPi.push({
                ...item,
                name: item.archivo.cxNombre,
                year: this.yearNav,
                date: `${item.archivo.dfFechaCarga} ${item.archivo.dfHoraCarga}`,
              });
            }
            const tmpFilesActas: any[] = [];
            for (const item of value.respuesta.actas) {
              tmpFilesActas.push({
                ...item,
                name: item.archivo.cxNombre,
                year: this.yearNav,
                date: `${item.archivo.dfFechaCarga} ${item.archivo.dfHoraCarga}`,
              });
            }
            this.filesArchivosPi = tmpFilesPi;
            this.filesActas = tmpFilesActas;
          }
        },
      });
  }

  validateWhereComeFrom(idSave: number) {
    this.idSaveValidar = idSave;
  }

  async onTableActionArchivosPi(event: TableButtonAction) {
    switch (event.name) {
      case 'download':
        if (event.value?.archivo?.cxUuid) {
          this.downloadFileAlf(
            event.value?.archivo?.cxUuid,
            event.value?.archivo?.cxNombre
          );
        } else {
          downloadInputFile(event.value.file);
        }
        break;
      case TableConsts.actionButton.delete:
        {
          const index = this.filesArchivosPi.findIndex(
            (item: any) => item.idCarga === event.value.idCarga
          );
          const tmpData = [...this.filesArchivosPi];
          tmpData.splice(index, 1);
          this.filesArchivosPi = tmpData;
        }
        break;
    }
  }

  async onTableActionActas(event: TableButtonAction) {
    switch (event.name) {
      case 'download':
        if (event.value?.archivo?.cxUuid) {
          this.downloadFileAlf(
            event.value?.archivo?.cxUuid,
            event.value?.archivo?.cxNombre
          );
        } else {
          downloadInputFile(event.value.file);
        }
        break;
      case TableConsts.actionButton.delete:
        {
          const index = this.filesActas.findIndex(
            (item: any) => item.idCarga === event.value.idCarga
          );
          const tmpData = [...this.filesActas];
          tmpData.splice(index, 1);
          this.filesActas = tmpData;
        }
        break;
    }
  }

  async submit() {
    this.isSubmiting = true;
    // COMMENT: Se genera array con los files existentes y para los nuevos se suben a alfresco - Archivos PI
    const arrToPi: any[] = [];
    if (this.filesArchivosPi?.length > 0) {
      for (const item of this.filesArchivosPi) {
        if (item.idCarga) {
          arrToPi.push({
            uuid: item.archivo.cxUuid,
          });
        } else {
          await this.uploadFileToAlfresco(item.file)
            .then((uuid) => {
              arrToPi.push({
                uuid,
                tipoArchivo: item.file.name.includes('.pdf') ? 1 : 2,
                nombre: item.file.name,
              });
            })
            .catch((err) => { });
        }
      }
    }

    // COMMENT: Se genera array con los files existentes y para los nuevos se suben a alfresco - Archivos de Actas
    const arrToActas: any[] = [];
    if (this.filesActas.length > 0) {
      for (const item of this.filesActas) {
        if (item.idCarga) {
          arrToActas.push({
            uuid: item.archivo.cxUuid,
          });
        } else {
          await this.uploadFileToAlfresco(item.file)
            .then((uuid) => {
              arrToActas.push({
                uuid,
                tipoArchivo: item.file.name.includes('.pdf') ? 1 : 2,
                nombre: item.file.name,
              });
            })
            .catch((err) => { });
        }
      }
    }

    const { epilogo } = this.form.getRawValue();
    const data: IEpilogoPayload = {
      idEstructura: !this.gestorSelected ? 0 : this.gestorSelected.idPrograma,
      descripcion: epilogo,
      cveUsuario: this.dataUser.cveUsuario,
      archivosPI: arrToPi,
      actas: arrToActas,
      estatus:
        this.form.valid &&
          this.filesArchivosPi?.length > 0 &&
          this.filesActas?.length > 0
          ? 'C'
          : 'I',
    };
    this.epilogoService
      .registrarEpilogo(data)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.isSubmiting = false;
          this.getEpilogoByIdEstructura();
          this.modalService.openGenericModal({
            idModal: 'modal-disabled',
            component: 'generic',
            data: {
              text: 'Se guardó correctamente.',
              labelBtnPrimary: 'Aceptar',
            },
          });
        },
        error: (err) => {
          this.isSubmiting = false;
        },
      });
  }

  onOutputFile(e: any) {
    if (e.type === 'pi') {
      const tmpFiles: any[] = [...this.filesArchivosPi];
      tmpFiles.push({
        name: e.newFile.name,
        year: this.yearNav,
        file: e.newFile,
      });
      this.filesArchivosPi = tmpFiles;
    }
    if (e.type === 'acta') {
      const tmpFiles: any[] = [...this.filesActas];
      tmpFiles.push({
        name: e.newFile.name,
        year: this.yearNav,
        file: e.newFile,
      });
      this.filesActas = tmpFiles;
    }
  }

  uploadFileToAlfresco(file: any) {
    const dataAlf: ISeguridadAlfResponse = this.ls.get('dataAlf');
    return this.alfrescoService.uploadFileToAlfrescoPromise(
      dataAlf.uuidPlaneacion,
      file
    );
  }

  downloadFileAlf(uid: string, fileName: string) {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid,
      fileName,
    });
  }

  questionsToValidate(): QuestionBase<any>[] {
    const questions: QuestionBase<any>[] = [];
    questions.push(...this.questions);
    questions.push(
      new TextareaQuestion({
        idElement: 76,
        nane: 'cargaDePI',
        label: 'Carga de PI',
      })
    );
    questions.push(
      new TextareaQuestion({
        idElement: 77,
        nane: 'actasDeSesión',
        label: 'Actas de Sesión',
      })
    );
    return questions;
  }

  finiish() {
    if (this.gestorSelected) {
      this.isSubmitingFinalize = true;
      this.principalService
        .finalizarRegistro(
          this.gestorSelected?.idPrograma ?? 0,
          this.dataUser.cveUsuario
        )
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.isSubmitingFinalize = false;
            if (value.mensaje.codigo === '200') {
              this.getGestorPorAnhio();
            }
          },
          error: (err) => {
            this.isSubmitingFinalize = false;
          },
        });
    }
  }

  send() {
    this.principalService
      .enviarARevison(
        this.gestorSelected?.idPrograma ?? 0,
        this.dataUser.cveUsuario
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200') {
            this.alertService.showAlert('Se envió a Revisión con Éxito.');
            this.router.navigate([
              '/Planeación/Planeación de Mediano Plazo/Ajustes',
            ]);
          }
        },
      });
  }

  disableBtnFinalize(): boolean {
    return (
      this.gestorSelected?.estatus !== 'C' &&
      this.gestorSelected?.estatus !== 'R' &&
      this.gestorSelected?.estatus !== 'O'
    );
  }

  disableBtnSend(): boolean {
    return this.gestorSelected?.estatus !== 'T';
  }

  download() {
    const report: any = this.generalReport;
    const objetivos: QuestionBase<any>[] = [
      new TextboxQuestion({
        nane: 'objetivos',
        label: 'Objetivos',
        value: ' ', //report.objetivos.map(objetivo => objetivo.cdObjetivo).join('\n')
      }),
    ].concat(
      report.objetivos.map(
        (objetivo) =>
          new TextboxQuestion({
            nane: '',
            label: '',
            value: objetivo.cdObjetivo + '.',
          })
      )
    );

    const estrategias: QuestionBase<any>[] = [
      new TextboxQuestion({
        nane: 'Estrategias y acciones',
        label: 'Estrategias y acciones',
        value: ' ',
      }),
    ];

    report.objetivos.map((objetivo) => {
      if (objetivo.estrategias.length) {
        estrategias.push(
          new TextboxQuestion({
            nane: '',
            label: '',
            value: objetivo.estrategias,
          })
        );
      }
    });

    /* .concat(report.objetivos.map(objetivo =>
      new TextboxQuestion({
        nane: '',
        label: '',
        value: objetivo.estrategias,
      }))); */

    const metasBienestar: QuestionBase<any>[] = [
      new TextboxQuestion({
        nane: 'metasBienestar',
        label: 'Metas para el Bienestar',
        value: ' ',
      }),
    ].concat(
      report.metasBienestar.map(
        (meta) =>
          new TextboxQuestion({
            nane: '',
            label: '',
            value: meta.nombre,
          })
      )
    );

    const parametros: QuestionBase<any>[] = [
      new TextboxQuestion({
        nane: 'parametros',
        label: 'Parametros',
        value: ' ',
      }),
    ].concat(
      report.parametros.map(
        (parametro) =>
          new TextboxQuestion({
            nane: '',
            label: '',
            value: parametro.nombre,
          })
      ),
      new TextboxQuestion({
        nane: 'epilogo',
        label: 'Epílogo: Visión a Largo Plazo',
        value: report.epilogo,
      })
    );

    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({
        nane: 'nombrePrograma',
        label: 'Nombre del Programa Institucional',
        value: report.nombrePrograma,
      }),
      new TextboxQuestion({
        nane: 'analisis',
        label: 'Análisis',
        value: report.analisis,
      }),
      new TextboxQuestion({
        nane: 'problemasPublicos',
        label: 'Problemas públicos',
        value: report.problemasPublicos,
      }),

      /* new TextboxQuestion({
        nane: 'Estrategias y acciones',
        label: 'Estrategias y acciones',
        value: report.objetivos.map(objetivo => objetivo.estrategias).join('.\n'),
      }),
      new TextboxQuestion({
        nane: 'metasBienestar',
        label: 'Metas para el Bienestar',
        value: report.metasBienestar.map(meta => meta.nombre).join('.\n'),
      }),
      new TextboxQuestion({
        nane: 'parametros',
        label: 'Parametros',
        value: report.parametros.map(parametro => parametro.nombre).join('.\n'),
      }),
      new TextboxQuestion({
        nane: 'epilogo',
        label: 'Epílogo: Visión a Largo Plazo',
        value: report.epilogo,
      }), */
    ].concat(objetivos, estrategias, metasBienestar, parametros);

    this.dialog.open(ReportBuilderComponent, {
      data: {
        questions,
        reportName: 'Reporte general',
      },
      width: '1000px',
    });
  }

  getGeneralReport() {
    this.principalService
      .getGeneralReportByAnhio(this.yearNav)
      .subscribe((response) => {
        this.generalReport = response.respuesta;
      });
  }

  ngOnDestroy(): void {
    this.notifier.complete();
  }
}
