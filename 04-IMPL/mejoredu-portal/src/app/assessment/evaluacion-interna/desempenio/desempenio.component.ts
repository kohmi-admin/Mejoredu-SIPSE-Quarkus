import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
import { DesempenioService } from '@common/services/evaluacion/interna/desempenio.service';
import { AlfrescoService } from '@common/services/alfresco.service';
import * as SecureLS from 'secure-ls';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { getCanEdit, getFileType } from '@common/utils/Utils';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import {
  IDesempenioPayload,
  IItemDesempenioResponse,
} from '@common/interfaces/evaluacion/interna/desempenio.interface';
import { NumberQuestion } from '@common/form/classes/question-number.class';

@Component({
  selector: 'app-desempenio',
  templateUrl: './desempenio.component.html',
  styleUrls: ['./desempenio.component.scss'],
})
export class DesempenioComponent {
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
    { columnDef: 'actor', header: 'Actor', width: '180px' },
    {
      columnDef: 'nombreEvaluacion',
      header: 'Nombre de la Evaluación',
      alignLeft: true,
    },
    { columnDef: 'tipoInforme', header: 'Tipo de Informe' },
    { columnDef: 'observaciones', header: 'Observaciones / Recomendaciones' },
    {
      columnDef: 'atencionObservaciones',
      header: 'Atención de las Observaciones',
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
    private _dialog: MatDialog,
    private desempenioService: DesempenioService,
    private alfrescoService: AlfrescoService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.dataAlf = this.ls.get('dataAlf');
    this.privilegedUser =
      this.dataUser.idTipoUsuario === 'ENLACE' ||
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
          nane: 'actor',
          label: 'Actor',
          value: '',
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'nombreEvaluacion',
          label: 'Nombre de la Evaluación',
          value: '',
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'tipoInforme',
          label: 'Tipo de Informe',
          value: '',
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'observaciones',
          label: 'Observaciones',
          value: '',
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'atencionObservaciones',
          label: 'Atención de las Observaciones',
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
    this.getDesempenio();
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
          this.getDesempenio();
        }
      });
  }

  validateCanEdit(anio: number) {
    if (this.privilegedUser) {
      const newCanEdit = getCanEdit(anio);
      if (newCanEdit) {
        this.form.get('actor')?.enable({ emitEvent: false });
        this.form.get('nombreEvaluacion')?.enable({ emitEvent: false });
        this.form.get('tipoInforme')?.enable({ emitEvent: false });
        this.form.get('observaciones')?.enable({ emitEvent: false });
        this.form.get('atencionObservaciones')?.enable({ emitEvent: false });
      } else {
        this.form.get('actor')?.disable({ emitEvent: false });
        this.form.get('nombreEvaluacion')?.disable({ emitEvent: false });
        this.form.get('tipoInforme')?.disable({ emitEvent: false });
        this.form.get('observaciones')?.disable({ emitEvent: false });
        this.form.get('atencionObservaciones')?.disable({ emitEvent: false });
        this.newRegister();
      }
      this.canEdit = newCanEdit;
    }
  }

  getDesempenio() {
    this.data = [];
    const { anio } = this.form.getRawValue();
    this.desempenioService
      .getDesempenios(anio)
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
            nombre: item.cxNombre,
            uuid: item.cxUuid,
            idTipoDocumento: item.idTipoDocumento,
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
    const dataAction: IItemDesempenioResponse = event.value;
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
            actor: dataAction.actor,
            nombreEvaluacion: dataAction.nombreEvaluacion,
            tipoInforme: dataAction.tipoInforme,
            observaciones: dataAction.observaciones,
            atencionObservaciones: dataAction.atencionObservaciones,
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
            this.deleteDesempenio(dataAction.idEvaluacion);
          }
        }
        break;
    }
  }

  async submit() {
    if (this.form.valid && this.arrayFilesZip.length) {
      this.isSubmiting = true;

      const fileZip = await this.getFileToService(this.arrayFilesZip);

      const idEvaluacion = this.dataAction
        ? this.dataAction.idEvaluacion
        : null;
      const {
        anio,
        actor,
        nombreEvaluacion,
        tipoInforme,
        observaciones,
        atencionObservaciones,
      } = this.form.getRawValue();
      const dataPayload: IDesempenioPayload = {
        anhio: +anio,
        cveUsuario: this.dataUser.cveUsuario,
        actor,
        nombreEvaluacion,
        tipoInforme,
        observaciones,
        atencionObservaciones,
        documentoZip: fileZip,
        idEvaluacion,
      };
      this.desempenioService
        .createDesempenio(dataPayload)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.isSubmiting = false;
            if (value.mensaje.codigo === '200') {
              this.alertService.showAlert('Se Guardó Correctamente');
              this.getDesempenio();
              this.newRegister();
            }
          },
          error: (err) => {
            this.isSubmiting = false;
          },
        });
    }
  }

  deleteDesempenio(idDesempenio: number) {
    this.desempenioService
      .deleteDesempenio(idDesempenio)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200') {
            this.alertService.showAlert(`Se Eliminó Correctamente`);
            this.getDesempenio();
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
        actor: '',
        nombreEvaluacion: '',
        tipoInforme: '',
        observaciones: '',
        atencionObservaciones: '',
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
        value.documentoZip?.cveUsuario === this.dataUser.cveUsuario
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
