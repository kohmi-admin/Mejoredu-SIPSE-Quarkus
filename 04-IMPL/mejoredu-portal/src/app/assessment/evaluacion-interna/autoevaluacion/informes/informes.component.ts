import { Component, EventEmitter, Output } from '@angular/core';
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
import { InformeAutoevaluacionService } from '@common/services/evaluacion/interna/informe-autoevaluacion.service';
import {
  IInformeAutoPayload,
  IItemInformeAutoResponse,
} from '@common/interfaces/evaluacion/interna/informe-autoevaluacion.interface';
import { NumberQuestion } from '@common/form/classes/question-number.class';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import * as SecureLS from 'secure-ls';
import { AlfrescoService } from '@common/services/alfresco.service';
import { getCanEdit, getFileType } from '@common/utils/Utils';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { CatalogsService } from '@common/services/catalogs.service';
import { environment } from 'src/environments/environment';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { IItemCatalogoResponse } from '@common/interfaces/catalog.interface';

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
  catPeriodo: IItemCatalogoResponse[] = [];
  data: any[] = [];
  dataAction: any;
  columns: TableColumn[] = [
    {
      columnDef: 'anhio',
      header: 'Año',
      width: '80px',
    },
    { columnDef: 'periodo', header: 'Período', width: '180px' },
    {
      columnDef: 'nombreInforme',
      header: 'Nombre del Informe',
      alignLeft: true,
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
    private informeAutoevaluacionService: InformeAutoevaluacionService,
    private alfrescoService: AlfrescoService,
    private catalogService: CatalogsService
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
        value: this.yearNav,
        label: 'Año',
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'periodo',
        value: '',
        label: 'Período',
        filter: true,
        options: [],
        validators: [Validators.required],
      })
    );

    if (this.canEdit) {
      this.actions.edit = true;
      this.actions.delete = true;
      questions.push(
        new TextboxQuestion({
          nane: 'nombreInforme',
          value: '',
          label: 'Nombre del Informe',
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
        const { periodo } = this.form.getRawValue();
        if (value && periodo) {
          this.validateCanEdit(value);
          this.getInformes();
        }
      });
    this.form
      .get('periodo')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        const { anio } = this.form.getRawValue();
        if (value && anio) {
          this.validateCanEdit(anio);
          this.getInformes();
        }
      });
  }

  validateCanEdit(anio: number) {
    if (this.privilegedUser) {
      const newCanEdit = getCanEdit(anio);
      if (newCanEdit) {
        this.form.get('nombreInforme')?.enable({ emitEvent: false });
      } else {
        this.form.get('nombreInforme')?.disable({ emitEvent: false });
        this.newRegister();
      }
      this.canEdit = newCanEdit;
    }
  }

  getInformes() {
    this.data = [];
    const { anio, periodo } = this.form.getRawValue();
    this.informeAutoevaluacionService
      .getInformes(anio, periodo)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length) {
            this.data = value.respuesta.map((item) => ({
              ...item,
              periodo: this.getNamePeriodoById(item.periodo),
              nombreoDcumentosZIP: item.documentoZip?.cxNombre,
            }));
          } else {
            this.data = [];
          }
        },
        error: (err) => { },
      });
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['periodoSemestral']
      ),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(([dataPeriodo]) => {
        this.catPeriodo = dataPeriodo.catalogo;
        this.questions[1].options = mapCatalogData({
          data: dataPeriodo,
        });
        if (dataPeriodo.catalogo.length) {
          this.form
            .get('periodo')
            ?.setValue(dataPeriodo.catalogo[0].idCatalogo);
        }
      });
  }

  getNamePeriodoById(id: number): string {
    let returnValue = '';
    const finded = this.catPeriodo.find((item) => item.idCatalogo === id);
    if (finded) {
      returnValue = finded.cdOpcion;
    }
    return returnValue;
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
    const dataAction: IItemInformeAutoResponse = event.value;
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
            nombreInforme: dataAction.nombreInforme,
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
            this.deleteInforme(dataAction.idInforme);
          }
        }
        break;
    }
  }

  async submit() {
    if (this.form.valid && this.arrayFilesZip.length) {
      this.isSubmiting = true;

      const fileZip = await this.getFileToService(this.arrayFilesZip);

      const idInforme = this.dataAction ? this.dataAction.idInforme : null;
      const { anio, periodo, nombreInforme } = this.form.getRawValue();
      const dataPayload: IInformeAutoPayload = {
        anhio: +anio,
        periodo: +periodo,
        cveUsuario: this.dataUser.cveUsuario,
        nombreInforme,
        documentoZip: fileZip,
        idInforme,
      };
      this.informeAutoevaluacionService
        .createInforme(dataPayload)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.isSubmiting = false;
            if (value.mensaje.codigo === '200') {
              this.alertService.showAlert(`Se Guardó Correctamente`);
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
    this.informeAutoevaluacionService
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
        nombreInforme: '',
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
        value.cveUsuario === this.dataUser.cveUsuario
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
