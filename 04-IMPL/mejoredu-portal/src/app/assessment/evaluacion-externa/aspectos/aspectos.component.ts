import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DateQuestion } from '@common/form/classes/question-date.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { NumberQuestion } from '@common/form/classes/question-number.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import {
  IAspectosPayload,
  IItemAspectoResponse,
} from '@common/interfaces/evaluacion/externa/aspectos.interface';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';
import { AlfrescoService } from '@common/services/alfresco.service';
import { CatalogsService } from '@common/services/catalogs.service';
import { AspectosService } from '@common/services/evaluacion/externa/aspectos.service';
import { TblWidthService } from '@common/services/tbl-width.service';
import { getCanEdit, getFileType } from '@common/utils/Utils';
import * as moment from 'moment';
import { Observable, Subject, forkJoin, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-aspectos',
  templateUrl: './aspectos.component.html',
  styleUrls: ['./aspectos.component.scss'],
})
export class AspectosComponent {
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
      columnDef: 'no',
      header: 'No.',
      width: '80px',
    },
    {
      columnDef: 'cvePrograma',
      header: 'Clave del Programa',
    },
    {
      columnDef: 'aspectosSusceptiblesMejora',
      header: 'Aspecto Susceptible de Mejora',
    },
    {
      columnDef: 'actividades',
      header: 'Actividades',
    },
    {
      columnDef: 'areaResponsable',
      header: 'Área Responsable',
    },
    {
      columnDef: 'fechaTerminoFormat',
      header: 'Fecha de Término',
    },
    {
      columnDef: 'resultadosEsperados',
      header: 'Resultados Esperados',
    },
    {
      columnDef: 'productosEvidencias',
      header: 'Productos y Evidencias',
    },
    {
      columnDef: 'porcentajeAvance',
      header: 'Porcentaje de Avance',
    },
    {
      columnDef: 'observaciones',
      header: 'Observaciones',
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

  constructor(
    private _formBuilder: QuestionControlService,
    private alertService: AlertService,
    private _tblWidthService: TblWidthService,
    private aspectosService: AspectosService,
    private alfrescoService: AlfrescoService,
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
        label: 'Año',
        value: this.yearNav,
        validators: [Validators.required],
      })
    );

    if (this.canEdit) {
      this.actions.edit = true;
      this.actions.delete = true;

      questions.push(
        new NumberQuestion({
          nane: 'no',
          label: 'No.',
          value: '',
          validators: [Validators.required],
        })
      );

      questions.push(
        new DropdownQuestion({
          nane: 'clavePrograma',
          label: 'Clave del Programa',
          value: '',
          filter: true,
          options: [],
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'aspectosSusceptiblesMejora',
          label: 'Aspecto Susceptible de Mejora',
          value: '',
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'actividades',
          label: 'Actividades',
          value: '',
          validators: [Validators.required],
        })
      );

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
        new DateQuestion({
          nane: 'fechaTermino',
          // value: '2024-04-24T12:00:00.000Z',
          // value: new Date().toISOString(),
          // value: '2024-04-24',
          label: 'Fecha de Término',
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'resultadosEsperados',
          label: 'Resultados Esperados',
          value: '',
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'productosEvidencias',
          label: 'Productos y Evidencias',
          value: '',
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'porcentajeAvance',
          label: 'Porcentaje de Avance',
          value: '',
          validators: [Validators.required],
        })
      );

      questions.push(
        new TextboxQuestion({
          nane: 'observaciones',
          value: '',
          label: 'Observaciones',
          validators: [Validators.required],
        })
      );
      this.getCatalogs();
    }

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.valueChanges.pipe(takeUntil(this.notifier)).subscribe(() => {
      this.formUnchanged = false;
    });
    this.getAspectos();
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
          this.getAspectos();
        }
      });
  }

  validateCanEdit(anio: number) {
    if (this.privilegedUser) {
      const newCanEdit = getCanEdit(anio);
      if (newCanEdit) {
        this.form.get('no')?.enable({ emitEvent: false });
        this.form.get('clavePrograma')?.enable({ emitEvent: false });
        this.form
          .get('aspectosSusceptiblesMejora')
          ?.enable({ emitEvent: false });
        this.form.get('actividades')?.enable({ emitEvent: false });
        this.form.get('areaResponsable')?.enable({ emitEvent: false });
        this.form.get('fechaTermino')?.enable({ emitEvent: false });
        this.form.get('resultadosEsperados')?.enable({ emitEvent: false });
        this.form.get('productosEvidencias')?.enable({ emitEvent: false });
        this.form.get('porcentajeAvance')?.enable({ emitEvent: false });
        this.form.get('observaciones')?.enable({ emitEvent: false });
      } else {
        this.form.get('no')?.disable({ emitEvent: false });
        this.form.get('clavePrograma')?.disable({ emitEvent: false });
        this.form
          .get('aspectosSusceptiblesMejora')
          ?.disable({ emitEvent: false });
        this.form.get('actividades')?.disable({ emitEvent: false });
        this.form.get('areaResponsable')?.disable({ emitEvent: false });
        this.form.get('fechaTermino')?.disable({ emitEvent: false });
        this.form.get('resultadosEsperados')?.disable({ emitEvent: false });
        this.form.get('productosEvidencias')?.disable({ emitEvent: false });
        this.form.get('porcentajeAvance')?.disable({ emitEvent: false });
        this.form.get('observaciones')?.disable({ emitEvent: false });
        this.newRegister();
      }
      this.canEdit = newCanEdit;
    }
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['clavePrograma']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['direccionGeneral']
      ),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(([dataClavePrograma, dataAreaResponsable]) => {
        this.questions[2].options = mapCatalogData({
          data: dataClavePrograma,
        });
        this.questions[5].options = mapCatalogData({
          data: dataAreaResponsable,
        });
      });
  }

  getAspectos() {
    this.data = [];
    const { anio } = this.form.getRawValue();
    this.aspectosService
      .getAspectos(anio)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length) {
            this.data = value.respuesta.map((item) => ({
              ...item,
              nombreoDcumentosZIP: item.documentoProbatorio?.cxNombre,
              fechaTerminoFormat: moment(
                item.fechaTermino,
                'YYYY-MM-DD'
              ).format('DD-MM-YYYY'),
              cveUsuario: item.documentoProbatorio?.cveUsuario,
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
    const dataAction: IItemAspectoResponse = event.value;
    switch (event.name) {
      case 'download':
        if (dataAction.documentoProbatorio?.cxUuid) {
          this.downloadFileAlf(
            dataAction.documentoProbatorio?.cxUuid,
            dataAction.documentoProbatorio?.cxNombre
          );
        }
        break;
      case TableConsts.actionButton.edit:
        this.dataAction = dataAction;
        this.form.patchValue(
          {
            no: dataAction.no,
            clavePrograma: dataAction.idCvePrograma,
            aspectosSusceptiblesMejora: dataAction.aspectosSusceptiblesMejora,
            actividades: dataAction.actividades,
            areaResponsable: dataAction.idAreaResponsable,
            fechaTermino: `${dataAction.fechaTermino}T21:55:29.771Z`,
            resultadosEsperados: dataAction.resultadosEsperados,
            productosEvidencias: dataAction.productosEvidencias,
            porcentajeAvance: dataAction.porcentajeAvance,
            observaciones: dataAction.observaciones,
          },
          { emitEvent: false }
        );
        if (dataAction.documentoProbatorio) {
          this.arrayFilesZip = [
            {
              ...dataAction.documentoProbatorio,
              name: dataAction.documentoProbatorio.cxNombre,
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
            this.deleteAspecto(dataAction.idAspectosSusceptibles);
          }
        }
        break;
    }
  }

  async submit() {
    if (this.form.valid && this.arrayFilesZip.length) {
      this.isSubmiting = true;

      const fileZip = await this.getFileToService(this.arrayFilesZip);

      const idAspectosSusceptibles = this.dataAction
        ? this.dataAction.idAspectosSusceptibles
        : null;
      const {
        anio,
        no,
        clavePrograma,
        aspectosSusceptiblesMejora,
        actividades,
        areaResponsable,
        fechaTermino,
        resultadosEsperados,
        productosEvidencias,
        porcentajeAvance,
        observaciones,
      } = this.form.getRawValue();

      const dataPayload: IAspectosPayload = {
        anhio: +anio,
        cveUsuario: this.dataUser.cveUsuario,
        no,
        cvePrograma: clavePrograma,
        aspectosSusceptiblesMejora,
        actividades,
        idAreaResponsable: areaResponsable,
        fechaTermino: moment(fechaTermino).format('YYYY-MM-DD'),
        resultadosEsperados,
        productosEvidencias,
        porcentajeAvance,
        observaciones,
        documentoProbatorio: fileZip,
        idAspectosSusceptibles,
      };
      this.aspectosService
        .createAspecto(dataPayload)
        .pipe(takeUntil(this.notifier))
        .subscribe({
          next: (value) => {
            this.isSubmiting = false;
            if (value.mensaje.codigo === '200') {
              this.alertService.showAlert('Se Guardó Correctamente');
              this.getAspectos();
              this.newRegister();
            }
          },
          error: (err) => {
            this.isSubmiting = false;
          },
        });
    }
  }

  deleteAspecto(idInforme: number) {
    this.aspectosService
      .deleteAspecto(idInforme)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200') {
            this.alertService.showAlert(`Se Eliminó Correctamente`);
            this.getAspectos();
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
        no: '',
        clavePrograma: '',
        aspectosSusceptiblesMejora: '',
        actividades: '',
        areaResponsable: '',
        fechaTermino: '',
        resultadosEsperados: '',
        productosEvidencias: '',
        porcentajeAvance: '',
        observaciones: '',
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
        value.documentoProbatorio.cveUsuario === this.dataUser.cveUsuario
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
