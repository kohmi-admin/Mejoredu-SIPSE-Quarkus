import { Component, Inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { MetaComponent } from '../meta/meta.component';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { DateQuestion } from '@common/form/classes/question-date.class';
import { TableColumn } from '@common/models/tableColumn';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { AvancesService } from '@common/services/seguimiento/avances/avances.service';
import { Subject, forkJoin, lastValueFrom, take } from 'rxjs';
import { CatalogsService } from '@common/services/catalogs.service';
import { environment } from 'src/environments/environment';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import * as SecureLS from 'secure-ls';
import { IArchivoPnP } from '@common/interfaces/seguimiento/avances.interface';
import { AlfrescoService } from '@common/services/alfresco.service';
import { GlobalFunctionsService } from '@common/services/global-functions.service';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { getCveActividad } from '@common/utils/Utils';
import { AlertService } from '@common/services/alert.service';

@Component({
  selector: 'app-no-programados',
  templateUrl: './no-programados.component.html',
  styleUrls: ['./no-programados.component.scss'],
})
export class NoProgramadosComponent {
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  mounths = [
    {
      name: 'Número de Productos Programados',
      items: [
        { name: 'Enero', value: 2 },
        { name: 'Febrero', value: 1 },
        { name: 'Marzo', value: 2 },
      ],
    },
    {
      name: 'Número de Productos Entregados por Mes',
      items: [
        { name: 'Abril', value: 1 },
        { name: 'Mayo', value: 1 },
        { name: 'Junio', value: 1 },
      ],
    },
  ];
  tableData: any[] = [];
  columns: TableColumn[] = [
    { columnDef: 'nombre', header: 'Nombre del Documento', alignLeft: true },
    { columnDef: 'fechaCarga', header: 'Fecha de Carga', width: '140px' },
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
  ls = new SecureLS({ encodingType: 'aes' });
  filesArchivos: IArchivoPnP[] = [];
  arrayFiles: any[] = [];
  notifier = new Subject();
  dataUser: IDatosUsuario;
  dataAlf: ISeguridadAlfResponse;

  constructor(
    public dialogRef: MatDialogRef<MetaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: QuestionControlService,
    private _avancesService: AvancesService,
    private catalogService: CatalogsService,
    private alfrescoService: AlfrescoService,
    private globalFuntions: GlobalFunctionsService,
    private alertService: AlertService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.dataAlf = this.ls.get('dataAlf');
    this.buildForm();
    this.getCatalogs();
  }

  buildForm(): void {
    const questions: any = [];

    questions.push(
      new DropdownQuestion({
        nane: 'idActividad',
        value: '2023',
        label: 'Clave y Nombre de la Actividad',
        filter: true,
        options: [
          {
            id: '001 Desarrollar acciones de coordinación y seguimiento del Sistema Nacional de Mejora Continua de la Educación',
            value:
              '001 Desarrollar acciones de coordinación y seguimiento del Sistema Nacional de Mejora Continua de la Educación',
          },
          {
            id: '002 Gestionar las políticas y procesos de MEJOREDU',
            value: '002 Gestionar las políticas y procesos de MEJOREDU',
          },
          {
            id: '003 Desarrollar la Estrategia de comunicación institucional',
            value:
              '003 Desarrollar la Estrategia de comunicación institucional',
          },
        ],
        validators: [Validators.required],
      })
    );

    // IEvidencia
    questions.push(
      new TextareaQuestion({
        nane: 'descripcionTareas',
        label: 'Descripción de Tareas Realizadas',
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'descripcionProducto',
        label: 'Descripción del Producto Alcanzado',
      })
    );

    // IEvidenciaComplementaria
    questions.push(
      new DropdownQuestion({
        nane: 'idArticulacion',
        label:
          'Articulación con Actividades o Productos del Presente Ejercicio',
        filter: true,
        options: [
          {
            id: '001 Desarrollar acciones de coordinación y seguimiento del Sistema Nacional de Mejora Continua de la Educación',
            value:
              '001 Desarrollar acciones de coordinación y seguimiento del Sistema Nacional de Mejora Continua de la Educación',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'dificultad',
        label: 'Dificultades para su Realización',
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'revisado',
        label: 'Revisado por la Junta Directiva',
        filter: true,
        options: [
          {
            id: true,
            value: 'Sì',
          },
          {
            id: false,
            value: 'No',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DateQuestion({
        nane: 'fechaSesion',
        label: 'Fecha de Sesión',
        disabled: true,
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'aprobado',
        label: 'Aprobado por la Junta Directiva',
        disabled: true,
        validators: [Validators.required],
      })
    );

    questions.push(
      new DateQuestion({
        nane: 'fechaAprobacion',
        label: 'Fecha de Aprobación',
        disabled: true,
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'publicacion',
        label: 'Publicación',
        filter: true,
        options: [
          {
            id: true,
            value: 'Sì',
          },
          {
            id: false,
            value: 'No',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'tipoPublicacion',
        label: 'Tipo de Publicación',
        filter: true,
        disabled: true,
        options: [
          {
            id: 'DOF',
            value: 'DOF',
          },
          {
            id: 'Web MejorEdu',
            value: 'Web MejorEdu',
          },
          {
            id: 'Impreso',
            value: 'Impreso',
          },
          {
            id: 'Otro',
            value: 'Otro',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'especificarPublicacion',
        label: 'Especificar',
        disabled: true,
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'difusion',
        label: 'Difusión',
        filter: true,
        options: [
          {
            id: true,
            value: 'Sì',
          },
          {
            id: false,
            value: 'No',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'tipoDifusion',
        label: 'Tipo de Difusión',
        filter: true,
        disabled: true,
        options: [
          {
            id: 'Web MejorEdu',
            value: 'Web MejorEdu',
          },
          {
            id: 'Redes Sociales',
            value: 'Redes Sociales',
          },
          {
            id: 'Otro',
            value: 'Otro',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'especificarDifusion',
        label: 'Especificar',
        disabled: true,
      })
    );

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.get('revisado')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('aprobado')?.enable();
        this.form.get('fechaSesion')?.enable();
        this.form.get('fechaAprobacion')?.enable();
      } else {
        this.form.get('aprobado')?.disable();
        this.form.get('aprobado')?.setValue('');
        this.form.get('fechaSesion')?.disable();
        this.form.get('fechaSesion')?.setValue('');
        this.form.get('fechaAprobacion')?.disable();
        this.form.get('fechaAprobacion')?.setValue('');
      }
    });
    this.form.get('publicacion')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('tipoPublicacion')?.enable();
      } else {
        this.form.get('tipoPublicacion')?.disable();
        this.form.get('tipoPublicacion')?.setValue('');
      }
    });
    this.form.get('tipoPublicacion')?.valueChanges.subscribe((value) => {
      if (value === 2636) {
        this.form.get('especificarPublicacion')?.enable();
      } else {
        this.form.get('especificarPublicacion')?.disable();
        this.form.get('especificarPublicacion')?.setValue('');
      }
    });
    this.form.get('difusion')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('tipoDifusion')?.enable();
      } else {
        this.form.get('tipoDifusion')?.disable();
        this.form.get('tipoDifusion')?.setValue('');
      }
    });
    this.form.get('tipoDifusion')?.valueChanges.subscribe((value) => {
      if (value === 2640) {
        this.form.get('especificarDifusion')?.enable();
      } else {
        this.form.get('especificarDifusion')?.disable();
        this.form.get('especificarDifusion')?.setValue('');
      }
    });
  }

  getCatalogs() {
    forkJoin([
      this._avancesService.consultarActividadesPorAnhio(
        this.ls.get('yearNav'),
        null,
        null
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipoPublicación']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipoDifusion']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['nombreIndicadorMIR']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['continuidadOtrosProductosAnhosAnteriores'] //FIX: Modificación de catalogo de articulacionActividad => continuidadOtrosProductosAnhosAnteriores
      ),
    ])
      .pipe(take(1))
      .subscribe(
        ([
          actividades,
          tipoPublicación,
          tipoDifusion,
          dataNombreIndicadorMIR,
          articulacionActividad,
        ]) => {
          let questionArtic = this.questions.find(
            (i) => i.nane === 'idArticulacion'
          );
          if (questionArtic) {
            questionArtic.options = mapCatalogData({
              data: articulacionActividad,
            });
          }

          let questionAct = this.questions.find(
            (i) => i.nane === 'idActividad'
          );
          if (questionAct) {
            questionAct.options = actividades.respuesta.map((i: any) => ({
              id: i.idActividad,
              value: `${getCveActividad({
                numeroActividad: i.cveActividad,
                cveProyecto: i.cveProyecto,
                cveUnidad: i.cveUnidad,
              })} ${i.cxNombreActividad}`,
            }));
          }

          let questionTP = this.questions.find(
            (i) => i.nane === 'tipoPublicacion'
          );
          if (questionTP) {
            questionTP.options = mapCatalogData({
              data: tipoPublicación,
            });
          }

          let questionTD = this.questions.find(
            (i) => i.nane === 'tipoDifusion'
          );
          if (questionTD) {
            questionTD.options = mapCatalogData({
              data: tipoDifusion,
            });
          }

          let indicador = this.questions.find((i) => i.nane === 'indicadorMIR');
          if (indicador) {
            indicador.options = mapCatalogData({
              data: dataNombreIndicadorMIR,
              withOptionNoAplica: true,
              withOptionSelect: true,
            });
          }
        }
      );
  }

  async getAll(): Promise<void> {
    this.data = [
      {
        document: 'Documento 1',
        date: '18/12/2023',
      },
    ];
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case 'download':
        if (event.value?.uuid) {
          this.downloadFileAlf(event.value?.uuid, event.value?.nombre);
        } else {
          this.globalFuntions.downloadInputFile(event.value.file);
        }
        break;
      case TableConsts.actionButton.delete:
        {
          const index = this.filesArchivos.findIndex(
            (item: IArchivoPnP) => item.idArchivo === event.value.idArchivo
          );
          const tmpData = [...this.filesArchivos];
          tmpData.splice(index, 1);
          this.filesArchivos = tmpData;
        }
        break;
    }
  }

  downloadFileAlf(uid: string, fileName: string) {
    this.alfrescoService.viewOrDownloadFileAlfService({
      action: 'download',
      uid,
      fileName,
    });
  }

  handleAddFile() {
    const tmpFiles: any[] = [...this.filesArchivos];
    tmpFiles.push({
      nombre: this.arrayFiles[0].name,
      file: this.arrayFiles[0],
    });
    this.filesArchivos = tmpFiles;
    this.arrayFiles = [];
  }

  async uploadFiles(): Promise<IArchivoPnP[]> {
    const arrToFiles: IArchivoPnP[] = [];
    if (this.filesArchivos?.length > 0) {
      for (const item of this.filesArchivos) {
        if (item.idArchivo) {
          arrToFiles.push(item);
        } else {
          await this.alfrescoService
            .uploadFileToAlfrescoPromise(
              this.dataAlf.uuidSeguimiento,
              item.file
            )
            .then((uuid) => {
              arrToFiles.push({
                uuid,
                nombre: item?.file?.name,
              });
            })
            .catch((err) => { });
        }
      }
    }
    return arrToFiles;
  }

  async register(files: IArchivoPnP[]): Promise<void> {
    await lastValueFrom(
      this._avancesService.productosNoProgramados(
        {
          idActividad: this.form.get('idActividad')?.value,
          cveUsuario: this.dataUser.cveUsuario,
          mes: new Date().getMonth() + 1,
          evidencia: {
            descripcionTareas: this.form.get('descripcionTareas')?.value,
            descripcionProducto: this.form.get('descripcionProducto')?.value,
            archivos: files,
          },
          evidenciaComplementaria: {
            dificultad: this.form.get('dificultad')?.value,
            revisado: this.form.get('revisado')?.value,
            fechaSesion: this.form.get('fechaSesion')?.value,
            aprobado: this.form.get('aprobado')?.value,
            fechaAprobacion: this.form.get('fechaAprobacion')?.value,
            publicacion: this.form.get('publicacion')?.value,
            tipoPublicacion: this.form.get('tipoPublicacion')?.value,
            especificarPublicacion: this.form.get('especificarPublicacion')
              ?.value,
            difusion: this.form.get('difusion')?.value,
            tipoDifusion: this.form.get('tipoDifusion')?.value,
            especificarDifusion: this.form.get('especificarDifusion')?.value,
            idArticulacion: this.form.get('idArticulacion')?.value,
          },
        },
        this.dataUser.cveUsuario
      )
    );
    this.alertService.showAlert('Se Guardó Correctamente');
  }

  async submit(): Promise<void> {
    const files = await this.uploadFiles();
    await this.register(files);
    this.dialogRef.close(this.form.value);
  }
}
