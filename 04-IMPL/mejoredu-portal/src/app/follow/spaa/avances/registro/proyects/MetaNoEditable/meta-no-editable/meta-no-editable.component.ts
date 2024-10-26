import { Component, Inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { AlfrescoService } from '@common/services/alfresco.service';
import { CatalogsService } from '@common/services/catalogs.service';
import { GlobalFunctionsService } from '@common/services/global-functions.service';
import { AvancesService } from '@common/services/seguimiento/avances/avances.service';
import { TableColumn } from 'exceljs';
import { Subject, takeUntil, forkJoin, take, lastValueFrom } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { environment } from 'src/environments/environment';
import { MetaComponent } from '../../meta/meta.component';
import * as moment from 'moment';
import {
  getCveActividad,
  getCveProducto,
  getGlobalStatus,
} from '@common/utils/Utils';
import { TabsControlService } from '../../../services/tabs-control.service';
import { ProductsService } from '@common/services/seguimiento/products.service';

@Component({
  selector: 'app-meta-no-editable',
  templateUrl: './meta-no-editable.component.html',
  styleUrls: ['./meta-no-editable.component.scss'],
})
export class MetaNoEditableComponent {
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  selectedMonth: number = 1;
  selectedMonthDelivered: number = 1;
  allEntregables: any[] = [];
  allActivities: any[] = [];
  products: any[] = [];
  isProductSelected: boolean = false;
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
  columns: any[] = [
    { columnDef: 'nombre', header: 'Nombre del Documento', alignLeft: true },
    { columnDef: 'fechaCarga', header: 'Fecha de Carga', width: '140px' },
  ];
  actions: TableActionsI = {
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
  activeProduct: any;

  constructor(
    public dialogRef: MatDialogRef<MetaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: QuestionControlService,
    private _avancesService: AvancesService,
    private catalogService: CatalogsService,
    private alfrescoService: AlfrescoService,
    private globalFuntions: GlobalFunctionsService,
    private productsFollowService: ProductsService,
    private _tabsControlService: TabsControlService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.dataAlf = this.ls.get('dataAlf');
    const questions: any = [];

    questions.push(
      new TextboxQuestion({
        nane: 'ixTipoMeta',
        value: '2023',
        label: 'Registro de Meta Vencida o Adelantada',
        filter: true,
        disabled: true,
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
      new TextboxQuestion({
        nane: 'idActividad',
        label: 'Clave y Nombre de la Actividad',
        disabled: true,
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'idProducto',
        label: 'Clave y Nombre del Producto',
        disabled: true,
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'mir',
        label: 'Indicador MIR/FID al que abona',
        value: 0,
        disabled: true,
        readonly: true,
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'estatus',
        value: 'Concluido',
        disabled: true,
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'descripcionTareas',
        label: 'Descripción de Tareas Realizadas',
        disabled: true,
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'descripcionProducto',
        label: 'Descripción del Producto Alcanzado',
        disabled: true,
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'idArticulacion',
        label:
          'Articulación con Actividades o Productos del Presente Ejercicio',
        disabled: true,
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'dificultad',
        label: 'Dificultades para su Realización',
        disabled: true,
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'revisado',
        label: 'Revisado por la Junta Directiva',
        disabled: true,
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
      new TextboxQuestion({
        nane: 'publicacion',
        label: 'Publicación',
        disabled: true,
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'tipoPublicacion',
        label: 'Tipo de Publicación',
        disabled: true,
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
      new TextboxQuestion({
        nane: 'difusion',
        label: 'Difusión',
        disabled: true,
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'tipoDifusion',
        label: 'Tipo de Difusión',
        disabled: true,
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
  }

  ngOnInit() {
    this.getCatalogs();
    this.form.get('idProducto')?.setValue(this.activeProduct.cveProducto);
    this.consultarEvidenciaMensual();
    this.consultarEvidenciaTrimestral();
    if (this.activeProduct.idProducto) {
      this.setMontoMensual();
    }
  }

  public setMontoMensual() {
    let mes = this.activeProduct.mes;
    this._avancesService
      .consultarAvance(this.activeProduct.idProducto)
      .subscribe((respuesta) => {
        this.mounths[1].value =
          respuesta.respuesta.productosProgramados[mes - 1].productosEntregados;
        //this.mounths[0].value = respuesta.respuesta.productosProgramados[mes-1].productosProgramados;
        this.selectedMonthDelivered = mes;
        //this.selectedMonth = mes;
      });
  }

  async consultarEvidenciaTrimestral() {
    let id =
      this.activeProduct.idProducto == null
        ? this.activeProduct.idAvance
        : this.activeProduct.idProducto;
    let trimestre =
      this.activeProduct.idProducto == null
        ? null
        : Math.ceil(this.activeProduct.mes / 3);
    const response = await lastValueFrom(
      this._avancesService.consultarEvidenciaTrimestral(id, trimestre)
    );
    //this.form.get('mir')?.setValue(response.respuesta.indicadorMIR);
    this.form.get('metaSuperada')?.setValue(response.respuesta.metaSuperada);
    this.form.get('dificultad')?.setValue(response.respuesta.dificultad);
    let revisado = response.respuesta.revisado == true ? 'Sì' : 'no';
    this.form.get('revisado')?.setValue(revisado);
    this.form.get('fechaSesion')?.setValue(response.respuesta.fechaSesion);
    this.form.get('aprobado')?.setValue(response.respuesta.aprobado);
    this.form
      .get('fechaAprobacion')
      ?.setValue(response.respuesta.fechaAprobacion);
    let publicacion = response.respuesta.publicacion == true ? 'Sì' : 'no';
    this.form.get('publicacion')?.setValue(publicacion);
    this.form
      .get('tipoPublicacion')
      ?.setValue(response.respuesta.cdTipoPublicacion);
    this.form
      .get('especificarPublicacion')
      ?.setValue(response.respuesta.especificarPublicacion);
    let difusion = response.respuesta.difusion == true ? 'Sì' : 'no';
    this.form.get('difusion')?.setValue(difusion);
    this.form.get('tipoDifusion')?.setValue(response.respuesta.cdTipoDifusion);
    this.form
      .get('especificarDifusion')
      ?.setValue(response.respuesta.especificarDifusion);
    /* this.form
      .get('indicadorMIR')
      ?.setValue(this._tabsControlService.product.indicadorMIR); */
  }

  async consultarEvidenciaMensual() {
    let id =
      this.activeProduct.idProducto == null
        ? this.activeProduct.idAvance
        : this.activeProduct.idProducto;
    let mes =
      this.activeProduct.idProducto == null ? null : this.activeProduct.mes;
    const response = await lastValueFrom(
      this._avancesService.consultarEvidenciaMensual(id, mes)
    );
    //this.form.get('estatus')?.setValue(getGlobalStatus(response.respuesta.estatus));
    this.form.get('justificacion')?.setValue(response.respuesta.justificacion);
    this.form
      .get('descripcionTareas')
      ?.setValue(response.respuesta.descripcionTareas);
    this.form
      .get('descripcionProducto')
      ?.setValue(response.respuesta.descripcionProducto);
    this.filesArchivos = response.respuesta.archivos.map((a) => {
      a.fechaCarga = moment(a.fechaCarga).format('YYYY-MM-DD');
      return a;
    });
  }

  getCatalogs() {
    forkJoin([
      this.productsFollowService.getProductByActivityIdSolicitud(
        this.activeProduct.idActividad,
        false,
        0
      ),
      this._avancesService.consultarActividadesPorAnhio(
        this.ls.get('yearNav'),
        null,
        null
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['categoria']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipoProducto']
      ),
    ])
      .pipe(take(1))
      .subscribe(([products, activities, dataCategoria, dataTipoProducto]) => {
        let product = products.respuesta.find(
          (i) => i.idProducto === this.activeProduct.idProducto
        );

        this.allActivities = activities.respuesta;
        const activity = this.allActivities.find(
          (i) => i.idActividad === this.activeProduct.idActividad
        );
        const cveActividad =
          getCveActividad({
            numeroActividad: activity.cveActividad,
            cveProyecto: activity.cveProyecto,
            cveUnidad: activity.cveUnidad,
          }) +
          ' ' +
          activity.cxNombreActividad;
        this.form.get('idActividad')?.setValue(cveActividad);
        if (product) {
          let indicadorMir =
            product.indicadorMIR == null ? 0 : product.indicadorMIR;
          this.form.get('mir')?.setValue(indicadorMir);
          /* const cveProducto = getCveProducto(
              {
                catTipoProducto: dataCategoria.catalogo,
                catCategoria: dataTipoProducto.catalogo,
                cveProyecto: activity.cveProyecto,
                cveUnidad: activity.cveUnidad,
                cveActividad: activity.cveActividad,
                cveProducto: parseInt(product.cveProducto),
                idCategorizacion: product.idCategorizacion,
                idTipoProducto: product.idTipoProducto,
              }
            ) + ' ' + product.nombre
            this.form.get('idProducto')?.setValue(cveProducto); */
        }
      });
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
}
