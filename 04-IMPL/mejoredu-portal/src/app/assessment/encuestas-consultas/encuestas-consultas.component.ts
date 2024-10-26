import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
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
import { Observable, Subject, forkJoin, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { AlfrescoService } from '@common/services/alfresco.service';
import { EncuestasService } from '@common/services/evaluacion/encuestas/encuestas.service';
import { getCanEdit, getFileType } from '@common/utils/Utils';
import {
  IEncuestaPayload,
  IItemEncuestaResponse,
} from '@common/interfaces/evaluacion/encuestas/encuestas.interface';
import { NumberQuestion } from '@common/form/classes/question-number.class';
import { environment } from 'src/environments/environment';
import { CatalogsService } from '@common/services/catalogs.service';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { IItemCatalogoResponse } from '@common/interfaces/catalog.interface';

@Component({
  selector: 'app-encuestas-consultas',
  templateUrl: './encuestas-consultas.component.html',
  styleUrls: ['./encuestas-consultas.component.scss'],
})
export class EncuestasConsultasComponent {
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
      columnDef: 'areaResponsable',
      header: 'Área Responsable',
    },
    {
      columnDef: 'tipoInstrumento',
      header: 'Tipo de Instrumento',
    },
    { columnDef: 'nombreInstrumento', header: 'Nombre del Instrumento' },
    { columnDef: 'objetivo', header: 'Objetivo' },
    { columnDef: 'nombreDocumentoZIP', header: 'Documento ZIP' },
    { columnDef: 'cveUsuario', header: 'Usuario' },
  ];
  actions: TableActionsI = {
    edit: false,
    delete: false,
    custom: [
      {
        id: 'download',
        name: 'Descargar',
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
  catAreaResponsable: IItemCatalogoResponse[] = [];

  constructor(
    private _formBuilder: QuestionControlService,
    private alertService: AlertService,
    private _tblWidthService: TblWidthService,
    private alfrescoService: AlfrescoService,
    private encuestasService: EncuestasService,
    private catalogService: CatalogsService
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
        value: this.yearNav,
        label: 'Año',
        validators: [Validators.required],
      })
    );

    if (this.canEdit) {
      this.actions.edit = true;
      this.actions.delete = true;

      questions.push(
        new DropdownQuestion({
          nane: 'areaResponsable',
          label: 'Área Responsable',
          value: '',
          filter: true,
          options: [],
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'tipoInstrumento',
          value: '',
          label: 'Tipo de Instrumento',
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'nombreInstrumento',
          value: '',
          label: 'Nombre del Instrumento',
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'objetivo',
          value: '',
          label: 'Objetivo',
          validators: [Validators.required],
        })
      );
    }

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.valueChanges.pipe(takeUntil(this.notifier)).subscribe(() => {
      this.formUnchanged = false;
    });

    this.getCatalogs();
    this.getEncuestas();
    this.suscribesForm();
    this.validateCanEdit(+this.yearNav);
  }

  getEncuestas() {
    this.data = [];
    const { anio } = this.form.getRawValue();
    this.encuestasService
      .getEncuestas(anio)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length) {
            this.data = value.respuesta.map((item) => {
              const areaResponsable = this.catAreaResponsable.find(
                (itemFind) => itemFind.idCatalogo === +item.areaResponsable
              );
              return {
                ...item,
                nombreDocumentoZIP: item.documentoZip?.cxNombre,
                cveUsuario: item.documentoZip?.cveUsuario,
                idAreaResponsable: +item.areaResponsable,
                areaResponsable: areaResponsable?.cdOpcion,
              };
            });
          }
        },
        error: (err) => { },
      });
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
          this.getEncuestas();
        }
      });
  }

  validateCanEdit(anio: number) {
    if (this.privilegedUser) {
      const newCanEdit = getCanEdit(anio);
      if (newCanEdit) {
        this.form.get('areaResponsable')?.enable({ emitEvent: false });
        this.form.get('tipoInstrumento')?.enable({ emitEvent: false });
        this.form.get('nombreInstrumento')?.enable({ emitEvent: false });
        this.form.get('objetivo')?.enable({ emitEvent: false });
      } else {
        this.form.get('areaResponsable')?.disable({ emitEvent: false });
        this.form.get('tipoInstrumento')?.disable({ emitEvent: false });
        this.form.get('nombreInstrumento')?.disable({ emitEvent: false });
        this.form.get('objetivo')?.disable({ emitEvent: false });
        this.newRegister();
      }
      this.canEdit = newCanEdit;
    }
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['direccionGeneral']
      ),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(([dataAreaResponsable]) => {
        this.catAreaResponsable = dataAreaResponsable.catalogo;
        if (this.canEdit) {
          this.questions[1].options = mapCatalogData({
            data: dataAreaResponsable,
          });
        }
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
    const dataAction: any = event.value;
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
            areaResponsable: dataAction.idAreaResponsable,
            tipoInstrumento: dataAction.tipoInstrumento,
            nombreInstrumento: dataAction.nombreInstrumento,
            objetivo: dataAction.objetivo,
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
            this.deleteEncuesta(dataAction.idEncuesta);
          }
        }
        break;
    }
  }

  async submit() {
    if (this.form.valid && this.arrayFilesZip.length) {
      this.isSubmiting = true;

      const fileZip = await this.getFileToService(this.arrayFilesZip);

      const idEncuesta = this.dataAction ? this.dataAction.idEncuesta : null;
      const {
        anio,
        areaResponsable,
        nombreInstrumento,
        objetivo,
        tipoInstrumento,
      } = this.form.getRawValue();
      const dataPayload: IEncuestaPayload = {
        anhio: +anio,
        areaResponsable,
        nombreInstrumento,
        objetivo,
        tipoInstrumento,
        cveUsuario: this.dataUser.cveUsuario,
        documentoZip: fileZip,
        idEncuesta: idEncuesta,
      };
      this.encuestasService
        .createEncuesta(dataPayload)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.isSubmiting = false;
            if (value.mensaje.codigo === '200') {
              this.alertService.showAlert('Se Guardó Correctamente');
              this.getEncuestas();
              this.newRegister();
            }
          },
          error: (err) => {
            this.isSubmiting = false;
          },
        });
    }
  }

  deleteEncuesta(idEncuesta: number) {
    this.encuestasService
      .deleteEncuesta(idEncuesta)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200') {
            this.alertService.showAlert(`Se Eliminó Correctamente`);
            this.getEncuestas();
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
        areaResponsable: '',
        tipoInstrumento: '',
        nombreInstrumento: '',
        objetivo: '',
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
