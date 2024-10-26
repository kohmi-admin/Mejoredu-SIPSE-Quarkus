import { Component, Inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import * as SecureLS from 'secure-ls';
import { CatalogsService } from '@common/services/catalogs.service';
import { ActivitiesService } from '@common/services/activities.service';
import { ProductsService } from '@common/services/products.service';
import { ProjectsService } from '@common/services/projects.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { IItemCatalogoResponse } from '@common/interfaces/catalog.interface';
import { IItemProjectsResponse } from '@common/interfaces/projects.interface';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { CheckboxQuestion } from '@common/form/classes/question-checkbox.class';
import { NumberQuestion } from '@common/form/classes/question-number.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IItemProductResponse } from '@common/interfaces/products.interface';
import { getCveProyecto, getNumeroActividad } from '@common/utils/Utils';
import { ParametersService } from '@common/services/medium-term/parameters.service';

export interface IProps {
  data: any;
  canEdit: boolean;
}

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  notifier = new Subject();
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];

  dataUser: IDatosUsuario;
  yearNav: string;

  dataProjects: IItemProjectsResponse[] = [];
  dataActivities: any[] = [];

  calendarización = [];
  activitySelected: any = null;
  projectSelected: IItemProjectsResponse | null = null;
  catCategoria: IItemCatalogoResponse[] = [];
  catObjetivosPrioritario: IItemCatalogoResponse[] = [];
  catIndicadorPI: IItemCatalogoResponse[] = [];
  catTipoProducto: IItemCatalogoResponse[] = [];

  formUnchanged = true;

  dataProductInject: any;

  constructor(
    public dialogRef: MatDialogRef<ViewProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProps,
    private _formBuilder: QuestionControlService,
    private catalogService: CatalogsService,
    private activitiesService: ActivitiesService,
    private productsService: ProductsService,
    private projectsService: ProjectsService,
    private parametersService: ParametersService
  ) {
    this.dataProductInject = data.data;
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.createQuestions();
    this.getAll();
  }

  createQuestions() {
    this.questions = [];

    this.questions.push(
      new DropdownQuestion({
        nane: 'nombreProyecto',
        label: 'Nombre del Proyecto',
        filter: true,
        disabled: true,
        options: [],
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'nombreActividad',
        label: 'Nombre de la Actividad',
        filter: true,
        disabled: true,
        options: [],
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new TextboxQuestion({
        nane: 'numeroProducto',
        label: 'Número del Producto',
        value: '00',
        disabled: true,
        validators: [Validators.required],
      })
    );

    this.questions.push(
      // Clave de Proyecto - Clave de Actividad - Número de Producto - Clave de Categoría - Tipo de Producto
      new TextboxQuestion({
        idElement: 106,
        nane: 'claveProducto',
        label: 'Clave del Producto',
        value: '0000-000-00-0-00',
        disabled: true,
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new TextareaQuestion({
        nane: 'nombreProducto',
        label: 'Nombre del Producto',
        disabled: true,
        rows: 2,
        validators: [Validators.required, Validators.maxLength(250)],
      })
    );

    this.questions.push(
      new TextareaQuestion({
        nane: 'descripcion',
        label: 'Descripción',
        disabled: true,
        rows: 4,
        validators: [Validators.required, Validators.maxLength(600)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'categorizacionProducto',
        label: 'Categorización del Producto',
        filter: true,
        disabled: true,
        options: [],
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'tipoProducto',
        label: 'Tipo del Producto',
        filter: true,
        disabled: true,
        options: [],
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'indicadorMIR',
        label: 'Indicador MIR',
        filter: true,
        disabled: true,
        options: [],
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'indicadorPI',
        label: 'Indicador PI',
        filter: true,
        disabled: true,
        options: [],
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'nivelEducativo',
        label: 'Nivel Educativo',
        filter: true,
        disabled: true,
        options: [],
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new TextareaQuestion({
        nane: 'vinculacionOtrosProductos',
        label: 'Vinculación con Otros Productos',
        rows: 4,
        disabled: true,
        validators: [Validators.required, Validators.maxLength(600)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'continuidadOtrosProductosAnhosAnteriores',
        label: 'Continuidad de Otros Productos de Años Anteriores',
        filter: true,
        disabled: true,
        options: [],
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new CheckboxQuestion({
        nane: 'porPublicar',
        label: 'Por Publicar',
        disabled: true,
      })
    );

    this.questions.push(
      new NumberQuestion({
        idElement: 116,
        nane: 'anhoPublicar',
        label: 'Año para Publicar',
        disabled: true,
        validators: [Validators.required],
      })
    );

    this.questions.push(
      new CheckboxQuestion({
        nane: 'requierePOTIC',
        label: 'Requiere POTIC',
        disabled: true,
      })
    );

    this.questions.push(
      new TextboxQuestion({
        disabled: true,
        nane: 'descripcionProyectoPOTIC',
        label: 'Descripción de Proyecto POTIC',
        validators: [Validators.maxLength(90)],
      })
    );

    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.valueChanges.pipe(takeUntil(this.notifier)).subscribe(() => {
      this.formUnchanged = false;
    });
    /* this.form
      .get('porPublicar')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value: boolean) => {
        if (value) {
          this.form.get('anhoPublicar')?.enable();
          this.form.get('anhoPublicar')?.setValue(new Date().getFullYear());
          this.form.setValidators([Validators.required]);
        } else {
          this.form.get('anhoPublicar')?.disable();
          this.form.get('anhoPublicar')?.setValue('');
        }
      });
    this.form
      .get('requierePOTIC')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value: boolean) => {
        if (value) {
          this.form.get('descripcionProyectoPOTIC')?.enable();
        } else {
          this.form.get('descripcionProyectoPOTIC')?.disable();
          this.form.get('descripcionProyectoPOTIC')?.setValue('');
        }
      }); */
  }

  ngOnInit() {
    this.form
      .get('nombreProyecto')
      ?.valueChanges.pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value) {
          this.form.get('nombreActividad')?.reset();
          this.form.get('numeroProducto')?.setValue('00');
          this.form.get('claveProducto')?.setValue('0000-000-00-0-00');
          this.form.get('indicadorPI')?.setValue('');
          this.questions[9].options = [];
          const findedProject = this.dataProjects.filter(
            (item) => item.idProyecto === value
          );
          if (findedProject?.length > 0) {
            this.projectSelected = findedProject[0];
          }
          this.setClaveProducto({
            projectSelected: this.projectSelected,
            activitySelected: this.activitySelected,
            claveProductoForm:
              this.form.get('claveProducto')?.getRawValue() || '',
            numeroProductoForm:
              this.form.get('numeroProducto')?.getRawValue() || '',
            categorizacionProductoForm:
              this.form.get('categorizacionProducto')?.getRawValue() || '',
            tipoProductoForm:
              this.form.get('tipoProducto')?.getRawValue() || '',
            setClaveProducto: true,
          });
          this.uploadIndicadorPI(value);
        }
      });
  }

  uploadIndicadorPI(idProyecto: number) {
    this.parametersService
      .getParamsByIdProyecto(idProyecto)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta?.length) {
            let newCatIndicadorPI: IItemCatalogoResponse[] =
              value.respuesta.map((item) => ({
                idCatalogo: item.idElemento,
                cdOpcion: item.nombre,
                ccExterna: '',
              }));
            this.questions[9].options = mapCatalogData({
              data: {
                catalogo: newCatIndicadorPI,
                mensaje: { codigo: '', mensaje: '' },
              },
              withOptionSelect: true,
              withOptionNoAplica: true,
            });
          } else {
            this.questions[9].options = [];
          }
        },
        error: (err) => {
          this.questions[9].options = [];
        },
      });
  }

  getAll() {
    this.getCatalogs();
    this.productsService
      .getProductById(this.dataProductInject.idProducto)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            this.getProjects(value.respuesta.idProyecto);
            this.form
              .get('nombreProyecto')
              ?.setValue(value.respuesta.idProyecto);
            this.getActivities(value.respuesta);
          }
        },
      });
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['categoria']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['tipoProducto']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['nombreIndicadorMIR']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['indicadorPI']
      ),

      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['objetivosPrioritario']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs[
        'continuidadOtrosProductosAnhosAnteriores'
        ]
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['anhoPublicar']
      ),
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['nivelEducativo']
      ),
    ])
      .pipe(takeUntil(this.notifier))
      .subscribe(
        ([
          dataCategoria,
          dataTipoProducto,
          dataNombreIndicadorMIR,
          dataIndicadorPI,
          dataObjetivosPrioritario,
          dataContinuidadOtrosProductosAnhosAnteriores,
          dataAnhoPublicar,
          dataNivelEducativo,
        ]) => {
          this.catCategoria = dataCategoria.catalogo;
          this.catTipoProducto = dataTipoProducto.catalogo;
          this.catIndicadorPI = dataIndicadorPI.catalogo;
          this.catObjetivosPrioritario = dataObjetivosPrioritario.catalogo;

          // COMMENT: categorizacionProducto
          this.questions[6].options = mapCatalogData({
            data: dataCategoria,
          });

          // COMMENT: tipoProducto
          this.questions[7].options = mapCatalogData({
            data: dataTipoProducto,
          });

          const getCustomNameIndicarMir = (
            item: IItemCatalogoResponse
          ): string => `${item.ccExterna} - ${item.cdOpcion}`;
          // COMMENT: indicadorMIR
          this.questions[8].options = mapCatalogData({
            data: dataNombreIndicadorMIR,
            getCustomValue: getCustomNameIndicarMir,
            withOptionNoAplica: true,
            withOptionSelect: true,
          });

          // COMMENT: nivelEducativo
          this.questions[10].options = mapCatalogData({
            data: dataNivelEducativo,
            withOptionNoAplica: true,
            withOptionSelect: true,
          });

          // COMMENT: continuidadOtrosProductosAnhosAnteriores
          this.questions[12].options = mapCatalogData({
            data: dataContinuidadOtrosProductosAnhosAnteriores,
            withOptionNoAplica: true,
          });

          // COMMENT: anhoPublicar
          this.questions[14].options = mapCatalogData({
            data: dataAnhoPublicar,
            withOptionNoAplica: true,
            withOptionSelect: true,
          });
        }
      );
  }

  getProjects(idProyecto: number) {
    this.projectsService
      .getProjectById(idProyecto)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.mensaje.codigo === '200') {
            this.projectSelected = value.proyecto[0];
            this.questions[0].options = [
              {
                id: value.proyecto[0].idProyecto,
                value: value.proyecto[0].nombre,
              },
            ];
          }
        },
      });
  }

  getActivities(dataProduct: IItemProductResponse) {
    this.activitiesService
      .getActivityByProjectId(dataProduct.idProyecto)
      .pipe(takeUntil(this.notifier))
      .subscribe((response) => {
        const tmpData: any[] = [];
        for (const item of response.respuesta) {
          tmpData.push({
            id: item.idActividad,
            value: item.cxNombreActividad,
          });
        }

        this.dataActivities = response.respuesta;
        this.questions[1].options = tmpData;
        this.form.get('nombreActividad')?.setValue(dataProduct.idActividad);
        this.activitySelected = this.dataActivities.filter(
          (item) => item.idActividad === dataProduct.idActividad
        )[0];
        this.uploadDataToForm(dataProduct);
      });
  }

  uploadDataToForm(dataAction: IItemProductResponse) {
    this.form.controls['numeroProducto'].setValue(dataAction.cveProducto);
    this.form.controls['nombreProducto'].setValue(dataAction.nombre);
    this.form.controls['descripcion'].setValue(dataAction.descripcion);
    this.form.controls['tipoProducto'].setValue(dataAction.idTipoProducto);
    this.form.controls['categorizacionProducto'].setValue(
      dataAction.idCategorizacion
    );
    this.form.controls['indicadorMIR'].setValue(
      dataAction.idIndicadorMIR ?? '0'
    );
    this.form.controls['indicadorPI'].setValue(dataAction.idIndicadorPI ?? '0');
    this.form.controls['nivelEducativo'].setValue(
      dataAction.idNivelEducativo ?? '0'
    );
    this.form.controls['vinculacionOtrosProductos'].setValue(
      dataAction.vinculacionProducto
    );
    this.form.controls['continuidadOtrosProductosAnhosAnteriores'].setValue(
      dataAction.idContinuidad ?? '0'
    );
    this.form.controls['porPublicar'].setValue(dataAction.porPublicar);
    this.form.controls['anhoPublicar'].setValue(dataAction.idAnhoPublicacion);
    this.form.controls['requierePOTIC'].setValue(
      dataAction.nombrePotic ? true : false
    );
    this.form.controls['descripcionProyectoPOTIC'].setValue(
      dataAction.nombrePotic
    );
    // COMMENT: generar la clave al vuelo, mandar a llamar la funcion
    setTimeout(() => {
      this.setClaveProducto({
        projectSelected: this.projectSelected,
        activitySelected: this.activitySelected,
        claveProductoForm: this.form.get('claveProducto')?.getRawValue() || '',
        numeroProductoForm:
          this.form.get('numeroProducto')?.getRawValue() || '',
        categorizacionProductoForm:
          this.form.get('categorizacionProducto')?.getRawValue() || '',
        tipoProductoForm: this.form.get('tipoProducto')?.getRawValue() || '',
        setClaveProducto: true,
      });
    }, 300);

    const tblCalendarizacion: any =
      document.getElementById('tblCalendarizacion');
    for (let i = 0, col; (col = tblCalendarizacion.rows[1].cells[i]); i++) {
      const monto = dataAction?.productoCalendario[i]?.monto ?? '';
      col.innerText = monto === 0 ? '' : monto;
    }
  }

  setClaveProducto({
    projectSelected,
    activitySelected,
    claveProductoForm,
    numeroProductoForm,
    categorizacionProductoForm,
    tipoProductoForm,
    setClaveProducto,
  }: {
    projectSelected: IItemProjectsResponse | null;
    activitySelected: any;
    claveProductoForm: string;
    numeroProductoForm: string;
    categorizacionProductoForm: number;
    tipoProductoForm: number;
    setClaveProducto: boolean;
  }) {
    const arrClaveProducto = claveProductoForm.split('-');

    // COMMENT: Clave del proyecto
    if (projectSelected) {
      const claveProyecto = getCveProyecto({
        cveProyecto: +projectSelected.clave,
        cveUnidad: projectSelected.claveUnidad,
      });
      arrClaveProducto[0] = String(claveProyecto);
    }

    // COMMENT: Clave de la actividad
    if (activitySelected) {
      const claveActividad = activitySelected.cveActividad;
      arrClaveProducto[1] = String(getNumeroActividad(claveActividad));
    }

    // COMMENT: Clave del producto
    if (numeroProductoForm !== '' && !numeroProductoForm?.includes('-')) {
      arrClaveProducto[2] = String(numeroProductoForm);
    }

    // COMMENT: Categorización del producto
    if (categorizacionProductoForm) {
      const findedCategorizacion = this.catCategoria.filter(
        (item) => item.idCatalogo === categorizacionProductoForm
      );
      if (findedCategorizacion?.length > 0) {
        arrClaveProducto[3] = String(findedCategorizacion[0].ccExterna);
      }
    }

    // COMMENT: Tipo del producto
    if (tipoProductoForm) {
      const findedTipoProducto = this.catTipoProducto.filter(
        (item) => item.idCatalogo === tipoProductoForm
      );
      if (findedTipoProducto?.length > 0) {
        arrClaveProducto[4] = String(findedTipoProducto[0].ccExterna);
      }
    }

    if (setClaveProducto) {
      this.form.get('claveProducto')?.setValue(arrClaveProducto.join('-'));
      return;
    } else {
      return arrClaveProducto.join('-');
    }
  }
}
