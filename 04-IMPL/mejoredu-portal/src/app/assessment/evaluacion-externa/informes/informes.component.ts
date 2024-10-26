import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';
import { TblWidthService } from '@common/services/tbl-width.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { InformesService } from '@common/services/evaluacion/externa/informes.service';
import * as SecureLS from 'secure-ls';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import {
  IInformesPayload,
  IItemInformeResponse,
} from '@common/interfaces/evaluacion/externa/informes.interface';
import { getCanEdit, getFileType } from '@common/utils/Utils';
import { NumberQuestion } from '@common/form/classes/question-number.class';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { AlfrescoService } from '@common/services/alfresco.service';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.scss'],
})
export class InformesComponent {
  @Output() setRecord: EventEmitter<any> = new EventEmitter<any>();
  ls = new SecureLS({ encodingType: 'aes' });
  dataUser: IDatosUsuario;
  yearNav: string;
  dataAlf: ISeguridadAlfResponse;
  data: any[] = [];
  dataAction: any;
  columns: TableColumn[] = [
    {
      columnDef: 'anhio',
      header: 'Año',
      width: '80px',
    },
    {
      columnDef: 'tipoEvaluacion',
      header: 'Tipo de Evaluación',
      width: '180px',
    },
    {
      columnDef: 'nombreEvaluacion',
      header: 'Nombre de la Evaluación',
      alignLeft: true,
    },
    { columnDef: 'tipoInforme', header: 'Tipo de Informe' },
    { columnDef: 'posicionInstitucional', header: 'Posición Institucional' },
    {
      columnDef: 'aspectosSusceptiblesMejora',
      header: 'Aspectos Susceptibles de Mejora',
    },
    { columnDef: 'nombreoDcumentosZIP', header: 'Documentos ZIP' },
    { columnDef: 'cveUsuario', header: 'Usuario' },
  ];
  actions: TableActionsI = {
    edit: false,
    delete: false,
    custom: [
      {
        id: 'download',
        name: 'Descargar Documento ZIP',
        icon: 'download',
      },
    ],
  };
  arrayFilesZip: any[] = [];
  isSubmiting: boolean = false;

  notifier = new Subject();
  formUnchanged = true;
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];

  canEdit: boolean = false;
  privilegedUser: boolean = false;

  constructor(
    private _formBuilder: QuestionControlService,
    private alertService: AlertService,
    private _tblWidthService: TblWidthService,
    private informesService: InformesService,
    private alfrescoService: AlfrescoService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.dataAlf = this.ls.get('dataAlf');
    this.privilegedUser =
      this.dataUser.idTipoUsuario === 'PLANEACION' ||
      this.dataUser.idTipoUsuario === 'ADMINISTRADOR';
    this.canEdit = this.privilegedUser;
    const questions: any = [];

    questions.push(
      new NumberQuestion({
        nane: 'anio',
        label: 'Año',
        value: this.yearNav,
        validators: [Validators.required],
      })
    );

    if (this.canEdit) {
      this.actions.edit = true;
      this.actions.delete = true;

      questions.push(
        new TextboxQuestion({
          nane: 'tipoEvaluacion',
          label: 'Tipo Evaluación',
          value: '',
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'nombreEvidencia',
          label: 'Nombre de la Evaluación',
          value: '',
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'tipoInforme',
          label: 'Tipo Informe',
          value: '',
          options: [
            {
              id: 'Informe Final',
              value: 'Informe Final',
            },
          ],
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'posicionInstitucional',
          label: 'Posición Institucional',
          value: '',
          options: [
            {
              id: 'Documento Institucional',
              value: 'Documento Institucional',
            },
          ],
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'aspectosSusceptiblesMejora',
          label: 'Aspectos Susceptibles de Mejora',
          value: '',
          validators: [Validators.required],
        })
      );
    }

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.valueChanges.pipe(takeUntil(this.notifier)).subscribe(() => {
      this.formUnchanged = false;
    });
    this.getInformes();
    this.suscribesForm();
    this.validateCanEdit(+this.yearNav);
  }

  getColWidth(widthLess: number, percent: number): number {
    return this._tblWidthService.getColWidth(widthLess, percent);
  }

  suscribesForm() {
    this.form
      .get('anio')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.validateCanEdit(value);
          this.getInformes();
        }
      });
  }

  validateCanEdit(anio: number) {
    if (this.privilegedUser) {
      const newCanEdit = getCanEdit(anio);
      if (newCanEdit) {
        this.form.get('tipoEvaluacion')?.enable({ emitEvent: false });
        this.form.get('nombreEvidencia')?.enable({ emitEvent: false });
        this.form.get('tipoInforme')?.enable({ emitEvent: false });
        this.form.get('posicionInstitucional')?.enable({ emitEvent: false });
        this.form
          .get('aspectosSusceptiblesMejora')
          ?.enable({ emitEvent: false });
      } else {
        this.form.get('tipoEvaluacion')?.disable({ emitEvent: false });
        this.form.get('nombreEvidencia')?.disable({ emitEvent: false });
        this.form.get('tipoInforme')?.disable({ emitEvent: false });
        this.form.get('posicionInstitucional')?.disable({ emitEvent: false });
        this.form
          .get('aspectosSusceptiblesMejora')
          ?.disable({ emitEvent: false });
        this.newRegister();
      }
      this.canEdit = newCanEdit;
    }
  }

  getInformes() {
    this.data = [];
    const { anio } = this.form.getRawValue();
    this.informesService
      .getInformes(anio)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length) {
            this.data = value.respuesta.map((item) => ({
              ...item,
              nombreoDcumentosZIP: item.documentoZip?.cxNombre,
              cveUsuario: item.documentoZip?.cveUsuario,
            }));
          }
        },
        error: (err) => { },
      });
  }

  public canDeactivate(): Observable<boolean> | boolean {
    return this.formUnchanged;
  }

  async getFileToService(arrayFiles: any[]) {
    let file: any = null;
    if (arrayFiles.length) {
      for (const item of arrayFiles) {
        if (item.cxUuid) {
          file = {
            uuid: item.cxUuid,
            idTipoDocumento: item.idTipoDocumento,
            nombre: item.cxNombre,
          };
        } else {
          await this.alfrescoService
            .uploadFileToAlfrescoPromise(this.dataAlf.uuidEvaluacion, item)
            .then((uuid) => {
              file = {
                uuid,
                idTipoDocumento: getFileType(item.name),
                nombre: item.name,
              };
            })
            .catch((err) => { });
        }
      }
    }
    return file;
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: IItemInformeResponse = event.value;
    switch (event.name) {
      case 'download':
        if (dataAction.documentoZip?.cxUuid) {
          this.downloadFileAlf(
            dataAction.documentoZip?.cxUuid,
            dataAction.documentoZip?.cxNombre
          );
        }
        break;
      case TableConsts.actionButton.edit:
        this.dataAction = dataAction;
        this.form.patchValue(
          {
            tipoEvaluacion: dataAction.tipoEvaluacion,
            nombreEvidencia: dataAction.nombreEvaluacion,
            tipoInforme: dataAction.tipoInforme,
            posicionInstitucional: dataAction.posicionInstitucional,
            aspectosSusceptiblesMejora: dataAction.aspectosSusceptiblesMejora,
          },
          { emitEvent: false }
        );
        if (dataAction.documentoZip) {
          this.arrayFilesZip = [
            {
              ...dataAction.documentoZip,
              name: dataAction.documentoZip.cxNombre,
            },
          ];
        }

        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this.alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar el Registro?',
          });
          if (confirm) {
            this.deleteInforme(dataAction.idInformeExterno);
          }
        }
        break;
    }
  }

  async submit() {
    if (this.form.valid && this.arrayFilesZip.length) {
      this.isSubmiting = true;

      const fileZip = await this.getFileToService(this.arrayFilesZip);

      const idInforme = this.dataAction
        ? this.dataAction.idInformeExterno
        : null;
      const {
        anio,
        tipoEvaluacion,
        nombreEvidencia,
        tipoInforme,
        posicionInstitucional,
        aspectosSusceptiblesMejora,
      } = this.form.getRawValue();
      const dataPayload: IInformesPayload = {
        anhio: +anio,
        cveUsuario: this.dataUser.cveUsuario,
        tipoEvaluacion,
        nombreEvaluacion: nombreEvidencia,
        tipoInforme,
        posicionInstitucional,
        aspectosSusceptiblesMejora,
        documentoZip: fileZip,
        idInformeExterno: idInforme,
      };
      this.informesService
        .createInforme(dataPayload)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.isSubmiting = false;
            if (value.mensaje.codigo === '200') {
              this.alertService.showAlert('Se Guardó Correctamente');
              this.getInformes();
              this.newRegister();
            }
          },
          error: (err) => {
            this.isSubmiting = false;
          },
        });
    }
  }

  deleteInforme(idInforme: number) {
    this.informesService
      .deleteInforme(idInforme)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200') {
            this.alertService.showAlert(`Se Eliminó Correctamente`);
            this.getInformes();
            this.newRegister();
          }
        },
        error: (err) => { },
      });
  }

  newRegister() {
    this.dataAction = undefined;
    this.resetForm();
  }

  resetForm() {
    this.form.patchValue(
      {
        tipoEvaluacion: '',
        nombreEvidencia: '',
        tipoInforme: '',
        posicionInstitucional: '',
        aspectosSusceptiblesMejora: '',
      },
      { emitEvent: false }
    );
    let inpFileZip: any = document.getElementById('inpFileZip');
    if (inpFileZip) inpFileZip.value = '';
    this.arrayFilesZip = [];
  }

  downloadFileAlf(uid: string, fileName: string) {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid,
      fileName,
    });
  }

  showActionIf = (action: string, value: any): boolean => {
    if (this.canEdit) {
      if (this.dataUser.idTipoUsuario === 'ADMINISTRADOR') {
        return true;
      }
      if (
        (action === 'edit' || action === 'delete') &&
        value.documentoZip.cveUsuario === this.dataUser.cveUsuario
      ) {
        return true;
      }
    }
    if (action === 'download') return true;
    return false;
  };

  ngOnDestroy(): void {
    this.notifier.complete();
  }
}
