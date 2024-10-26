import { Component, Inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DOCUMENT_TYPES } from '@common/enums/documentTypes.enum';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { IJustifiacionIndicadorPayload } from '@common/interfaces/seguimientoMirFid/justificacion.interface';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';
import { AlfrescoService } from '@common/services/alfresco.service';
import { GlobalFunctionsService } from '@common/services/global-functions.service';
import { P016Service } from '@common/services/seguimientoMirFid/p016.service';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-justify',
  templateUrl: './justify.component.html',
  styleUrls: ['./justify.component.scss'],
})
export class JustifyComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  dataUser: IDatosUsuario;
  dataAlf: ISeguridadAlfResponse;
  isSubmiting: boolean = false;
  form!: FormGroup;
  notifier = new Subject();
  questions: QuestionBase<string>[] = [];
  data: any[] = [];
  arrayFiles: any[] = [];
  filesArchivos: any[] = [];
  columns: TableColumn[] = [
    { columnDef: 'document', header: 'Nombre del Documento', alignLeft: true },
    { columnDef: 'date', header: 'Fecha de Carga', width: '140px' },
  ];
  actions: TableActionsI = {
    delete: true,
    custom: [
      {
        id: 'download',
        icon: 'download',
        name: 'Descargar',
      },
    ],
  };

  constructor(
    public dialogRef: MatDialogRef<JustifyComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModal: any,
    private _formBuilder: QuestionControlService,
    private globalFuntions: GlobalFunctionsService,
    private alfrescoService: AlfrescoService,
    private alertService: AlertService,
    private p016Service: P016Service
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.dataAlf = this.ls.get('dataAlf');

    this.createQuestions();

    if (this.dataUser.idTipoUsuario === 'CONSULTOR') {
      this.form.disable();
    }

    this.getAll();
  }

  createQuestions() {
    const questions: any = [];
    questions.push(
      new TextareaQuestion({
        nane: 'indicador',
        value: this.dataModal.indicador,
        label: 'Indicador',
        readonly: true,
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'avance',
        value: this.dataModal.alcanzadoAcumulado,
        type: 'number',
        label: 'Registro de Avance %',
        readonly: true,
        validators: [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
        ],
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'causa',
        label: 'Causa',
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'efecto',
        label: 'Efectos',
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'otrosMotivos',
        label: 'Otros Motivos',
        validators: [Validators.required],
      })
    );

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  getAll() {
    this.filesArchivos = [];
    let files: any[] = [];
    this.p016Service
      .getJustificacionIndicador(this.dataModal.id);
    this.p016Service.getJustificacionIndicador(this.dataModal.id)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {

          this.form.get('avance')?.setValue(value.respuesta.avance);
          this.form.get('causa')?.setValue(value.respuesta.causa);
          this.form.get('efecto')?.setValue(value.respuesta.efecto);
          this.form.get('otrosMotivos')?.setValue(value.respuesta.otrosMotivos);

          for (const item of value.respuesta.archivos) {
            const formattedDate = this.convertDate(item.fechaCarga+"");
            files.push({
              ...item,
              document: item.nombre,
              date: formattedDate,
            });
          }
          this.filesArchivos = files;
        },
      })
  }

  convertDate = (isoString: string): string => {
    const date = new Date(isoString);

    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan en 0
    const year = date.getUTCFullYear().toString();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  async handleAddFile() {
    const tmpFiles: any[] = [...this.filesArchivos];
    for (const item of this.arrayFiles) {
      tmpFiles.push({
        ...item,
        document: item.name,
        file: item,
        date: this.getFormattedDate(),
      });
    }
    this.filesArchivos = tmpFiles;
    this.arrayFiles = [];
  }

  getFormattedDate(): string {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case 'download':
        if (event.value?.uuid) {
          this.downloadFileAlf(event.value?.uuid, event.value?.nombre);
        } else {
          this.globalFuntions.downloadInputFile(event.value);
        }
        break;
      case TableConsts.actionButton.delete:
        {
          const index = this.filesArchivos.findIndex(
            (item: any) => item.idArchivo === event.value.idArchivo
          );
          const tmpData = [...this.filesArchivos];
          tmpData.splice(index, 1);
          this.filesArchivos = tmpData;
        }
        break;
    }
  }

  async submit() {
    if (this.form.valid) {
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
              .uploadFileToAlfrescoPromise(
                this.dataAlf.uuidSeguimiento,
                item.file
              )
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
      const { indicador, avance, causa, efecto, otrosMotivos } =
        this.form.getRawValue();
      const dataPayload: IJustifiacionIndicadorPayload = {
        idIndicador: this.dataModal.id,
        indicador,
        avance,
        archivos: arrToFiles,
        causa,
        efecto,
        otrosMotivos,
        cveUsuario: this.dataUser.cveUsuario,
      };
      this.p016Service
        .justificacionIndicador(dataPayload)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.isSubmiting = false;
            if (value.codigo === '200') {
              this.dialogRef.close('success');
              this.alertService.showAlert('Se Guardó Correctamente');
            }
          },
          error: (err) => {
            this.isSubmiting = false;
          },
        });
    }
  }

  downloadFileAlf(uid: string, fileName: string) {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid,
      fileName,
    });
  }

  ngOnDestroy() {
    this.notifier.complete();
  }
}
