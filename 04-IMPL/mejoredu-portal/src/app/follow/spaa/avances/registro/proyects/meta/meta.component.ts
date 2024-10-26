import { Component, Inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DateQuestion } from '@common/form/classes/question-date.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { ISeguridadAlfResponse } from '@common/interfaces/alfresco.interface';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { IArchivoPnP } from '@common/interfaces/seguimiento/avances.interface';
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
import { GlobalFunctionsService } from '@common/services/global-functions.service';
import { AvancesService } from '@common/services/seguimiento/avances/avances.service';
import { ProductsService } from '@common/services/seguimiento/products.service';
import { getCveActividad } from '@common/utils/Utils';
import { Subject, forkJoin, lastValueFrom, take, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-meta',
  templateUrl: './meta.component.html',
  styleUrls: ['./meta.component.scss'],
})
export class MetaComponent {
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  selectedMonth: number = 1;
  selectedMonthDelivered: string = '1';
  allEntregables: any[] = [];
  products: any[] = [];
  isProductSelected: boolean = false;
  montoEntregado: number = 0;
  mounths = [
    {
      name: 'Número de Productos Programados',
      disabled: true,
      options: [
        { value: 1, text: 'Enero' },
        { value: 2, text: 'Febrero' },
        { value: 3, text: 'Marzo' },
        { value: 4, text: 'Abril' },
        { value: 5, text: 'Mayo' },
        { value: 6, text: 'Junio' },
        { value: 7, text: 'Julio' },
        { value: 8, text: 'Agosto' },
        { value: 9, text: 'Septiembre' },
        { value: 10, text: 'Octubre' },
        { value: 11, text: 'Noviembre' },
        { value: 12, text: 'Diciembre' },
      ],
      value: 1,
    },
    {
      name: 'Número de Productos Entregados por Mes',
      disabled: false,
      options: [
        { value: 1, text: 'Enero' },
        { value: 2, text: 'Febrero' },
        { value: 3, text: 'Marzo' },
        { value: 4, text: 'Abril' },
        { value: 5, text: 'Mayo' },
        { value: 6, text: 'Junio' },
        { value: 7, text: 'Julio' },
        { value: 8, text: 'Agosto' },
        { value: 9, text: 'Septiembre' },
        { value: 10, text: 'Octubre' },
        { value: 11, text: 'Noviembre' },
        { value: 12, text: 'Diciembre' },
      ],
      value: 0,
    },
  ];
  auxMonths = [
    {
      name: 'Número de Productos Programados',
      disabled: true,
      options: [
        { value: 1, text: 'Enero' },
        { value: 2, text: 'Febrero' },
        { value: 3, text: 'Marzo' },
        { value: 4, text: 'Abril' },
        { value: 5, text: 'Mayo' },
        { value: 6, text: 'Junio' },
        { value: 7, text: 'Julio' },
        { value: 8, text: 'Agosto' },
        { value: 9, text: 'Septiembre' },
        { value: 10, text: 'Octubre' },
        { value: 11, text: 'Noviembre' },
        { value: 12, text: 'Diciembre' },
      ],
      value: 1,
    },
    {
      name: 'Número de Productos Entregados por Mes',
      disabled: false,
      options: [
        { value: 1, text: 'Enero' },
        { value: 2, text: 'Febrero' },
        { value: 3, text: 'Marzo' },
        { value: 4, text: 'Abril' },
        { value: 5, text: 'Mayo' },
        { value: 6, text: 'Junio' },
        { value: 7, text: 'Julio' },
        { value: 8, text: 'Agosto' },
        { value: 9, text: 'Septiembre' },
        { value: 10, text: 'Octubre' },
        { value: 11, text: 'Noviembre' },
        { value: 12, text: 'Diciembre' },
      ],
      value: 0,
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
    private productsFollowService: ProductsService,
    private _alertService: AlertService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.dataAlf = this.ls.get('dataAlf');
    const questions: any = [];

    questions.push(
      new DropdownQuestion({
        nane: 'ixTipoMeta',
        value: '2023',
        label: 'Registro de Meta Vencida o Adelantada',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Meta Vencida',
          },
          {
            id: 2,
            value: 'Meta Adelantada',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'idActividad',
        value: '2023',
        label: 'Clave y Nombre de la Actividad',
        filter: true,
        options: [],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'idProducto',
        value: '2023',
        label: 'Clave y Nombre del Producto',
        filter: true,
        options: [],
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'mir',
        label: 'Indicador MIR/FID al que abona',
        value: 0,
        readonly: true,
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'estatus',
        value: 'No Concluido',
        label: 'Estatus',
        filter: true,
        disabled: true,
        options: [
          {
            id: 'No Concluido',
            value: 'No Concluido',
          },
          {
            id: 'Concluido',
            value: 'Concluido',
          },
        ],
        validators: [Validators.required],
      })
    );

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

    questions.push(
      new DropdownQuestion({
        nane: 'idArticulacion',
        label:
          'Articulación con Actividades o Productos del Presente Ejercicio',
        filter: true,
        options: [],
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
            id: 'Sì',
            value: 'Sì',
          },
          {
            id: 'No',
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
            id: 'Sì',
            value: 'Sì',
          },
          {
            id: 'No',
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
          /*  {
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
           }, */
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
            id: 'Sì',
            value: 'Sì',
          },
          {
            id: 'No',
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
          /*  {
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
           }, */
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
      if (value == 'Sì') {
        this.form.get('fechaSesion')?.enable();
        this.form.get('aprobado')?.enable();
        this.form.get('fechaAprobacion')?.enable();
      } else {
        this.form.get('fechaSesion')?.disable();
        this.form.get('fechaSesion')?.setValue('');
        this.form.get('aprobado')?.disable();
        this.form.get('aprobado')?.setValue('');
        this.form.get('fechaAprobacion')?.disable();
        this.form.get('fechaAprobacion')?.setValue('');
      }
    });
    this.form
      .get('ixTipoMeta')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        const currentMonth = new Date().getMonth();
        const currentQuarter = Math.ceil(currentMonth / 3);
        const lastQuarter = currentQuarter == 1 ? 4 : currentQuarter - 1;
        const nextQuarter = currentQuarter == 4 ? 1 : currentQuarter + 1;
        this.mounths[0].options = this.auxMonths[0].options;
        if (value == 1) {
          this.mounths[0].options = this.mounths[0].options.slice(
            lastQuarter * 3,
            lastQuarter * 3 + 3
          );
        } else {
          this.mounths[0].options = this.mounths[0].options.slice(
            nextQuarter * 3,
            nextQuarter * 3 + 3
          );
        }
        this.selectedMonth = this.mounths[0].options[0].value;
        const yearNav = this.ls.get('yearNav');
        this._avancesService
          .consultarActividadesPorAnhio(yearNav, value, currentQuarter)
          .subscribe((actividades) => {
            let questionAct = this.questions.find(
              (i) => i.nane === 'idActividad'
            );
            if (questionAct) {
              questionAct.options = actividades.respuesta.map((i: any) => ({
                id: i.idActividad,
                value:
                  getCveActividad({
                    numeroActividad: i.cveActividad,
                    cveProyecto: i.cveProyecto,
                    cveUnidad: i.cveUnidad,
                  }) +
                  ' ' +
                  i.cxNombreActividad,
              }));
            }
          });
      });
    this.form
      .get('idActividad')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.form.get('idProducto')?.setValue('');
          this.getProductsByIdActivity(value);
        }
      });
    this.form
      .get('idProducto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.isProductSelected = true;
          let producto = this.products.filter((product) => {
            return product.idProducto == value;
          })[0];
          let indicadorMir =
            producto.indicadorMIR == null ? 0 : producto.indicadorMIR;
          this.form.get('mir')?.setValue(indicadorMir);
        }
      });
    this.form.get('publicacion')?.valueChanges.subscribe((value) => {
      if (value == 'Sì') {
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
      if (value == 'Sì') {
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
    this.form.statusChanges.subscribe((value) => {
      if (value && value == 'VALID') {
        this.form.get('estatus')?.setValue('Concluido');
      } else {
        this.form.get('estatus')?.setValue('No Concluido');
      }
    });
    this.getCatalogs();
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

  handleAddFile() {
    const tmpFiles: any[] = [...this.filesArchivos];
    tmpFiles.push({
      nombre: this.arrayFiles[0].name,
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
    const cveUsuario = this.dataUser.cveUsuario;
    let evidenciaComplementaria = {
      idArticulacion: this.form.get('idArticulacion')?.value,
      dificultad: this.form.get('dificultad')?.value,
      revisado: this.form.get('revisado')?.value == 'No' ? false : true,
      fechaSesion: this.form.get('fechaSesion')?.value,
      aprobado: this.form.get('aprobado')?.value,
      fechaAprobacion: this.form.get('fechaAprobacion')?.value,
      publicacion: this.form.get('publicacion')?.value == 'No' ? false : true,
      tipoPublicacion: this.form.get('tipoPublicacion')?.value,
      especificarPublicacion: this.form.get('especificarPublicacion')?.value,
      difusion: this.form.get('difusion')?.value == 'No' ? false : true,
      tipoDifusion: this.form.get('tipoDifusion')?.value,
      especificarDifusion: this.form.get('especificarDifusion')?.value,
      idProducto: this.form.get('idProducto')?.value,
      trimestre: Math.ceil(parseInt(this.selectedMonthDelivered) / 3),
      indicadorMIR: this.form.get('mir')?.value,
      metaSuperada: '',
    };
    await lastValueFrom(
      this._avancesService.regustrarMetaVA(
        {
          cveUsuario: this.dataUser.cveUsuario,
          ixTipoMeta: this.form.get('ixTipoMeta')?.value,
          idProducto: this.form.get('idProducto')?.value,
          mesProgramado: this.selectedMonth,
          mesEntregado: parseInt(this.selectedMonthDelivered),
          montoEntregado: this.montoEntregado,
          evidencia: {
            estatus: this.form.get('estatus')?.value,
            descripcionTareas: this.form.get('descripcionTareas')?.value,
            descripcionProducto: this.form.get('descripcionProducto')?.value,
            archivos: files,
          },
          evidenciaComplementaria: evidenciaComplementaria,
        },
        cveUsuario
      )
    );
    this._alertService.showAlert('Información Guardada');
  }

  async submit(): Promise<void> {
    const files = await this.uploadFiles();
    await this.register(files);
    this.dialogRef.close(this.form.value);
  }

  async getProductsByIdActivity(idActivity: string) {
    this.form.controls['nombreProducto']?.disable();
    this.questions[2].options = [];
    let excluirCortoPlazo: boolean = false,
      idSolicitud: number = 0;
    this.productsFollowService
      .getProductByActivityIdSolicitud(
        idActivity,
        excluirCortoPlazo,
        idSolicitud
      )
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length > 0) {
            const tmpData: any[] = [];
            for (const item of value.respuesta) {
              if (item.estatus !== 'I' && item.estatus !== 'B') {
                tmpData.push(item);
              }
            }
            this.form.controls['nombreProducto']?.enable();
            this.products = tmpData;
            this.questions[2].options = this.mapOptionProducts(tmpData);
            this.mounths[0].value = tmpData[0].productoCalendario[0].monto;
            this.allEntregables = tmpData[0].productoCalendario;
          }
        },
      });
  }

  public setMonthMonto() {
    this.mounths[0].value = this.allEntregables[this.selectedMonth - 1].monto;
  }

  private mapOptionProducts(products) {
    return products.map((product) => {
      return {
        id: product.idProducto,
        value: `${product.cveProducto} ${product.nombre}`,
      };
    });
  }

  public updateMontoEntregado(event) {
    this.montoEntregado = parseInt(event.value);
  }
}
