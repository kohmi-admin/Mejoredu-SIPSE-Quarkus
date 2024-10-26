import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { SwitchI } from './interfaces/switch.interface';
import { switches } from './utils/switches.const';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { SwitchManage } from './classes/switch-manage.class';
import { AlternSwitchService } from '../altern-switch/services/altern-switch.service';
import { SolicitudSeguimientoService } from '@common/services/seguimiento/solicitud-seguimiento.service';
import {
  IAdecuacionesPayload,
  IRegistrarSolicitudPayload,
} from '@common/interfaces/seguimiento/registrarSolicitud';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { TIPO_ADECUACION } from '../enum/tipoAdecuacion.enum';
import { AlertService } from '@common/services/alert.service';
import { IItemConsultaSolicitudResponse } from '@common/interfaces/seguimiento/consultaSolicitud';
import { getGlobalStatusSeguimiento } from '@common/utils/Utils';
import { TIPO_APARTADO } from '../enum/tipoApartado.enum';
import { MODIFICATION_TYPE } from '../enum/modification.enum';
import { ICatalogResponse } from '@common/interfaces/catalog.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general-data',
  templateUrl: './general-data.component.html',
  styleUrls: ['./general-data.component.scss'],
})
export class GeneralDataComponent extends SwitchManage {
  ls = new SecureLS({ encodingType: 'aes' });
  form!: FormGroup;
  questions: QuestionBase<any>[] = [];
  @Input() catDireccionGeneralR!: ICatalogResponse;
  @Input() secuencialSeguimiento: number = 0;
  @Input() catTipoAdecuacionR!: ICatalogResponse;
  @Input() override switches: SwitchI[] = switches;
  @Input() override tipoAdecuacion = 0;
  @Input() data!: { folioSolicitud: string; fechaSolicitud: string };
  @Output() onResponseSolicitud: EventEmitter<any> = new EventEmitter<void>();
  @Output() onSaveSolicitud: EventEmitter<any> = new EventEmitter<void>();

  notifier = new Subject();
  dataUser: IDatosUsuario;
  yearNav: string;
  isSubmiting: boolean = false;
  selectedSolicitud: IItemConsultaSolicitudResponse;
  disabledComponent: boolean = false;
  canEdit: boolean = true;

  constructor(
    private _formBuilder: QuestionControlService,
    private _alternSwitchService: AlternSwitchService,
    private solicitudSeguimientoService: SolicitudSeguimientoService,
    private _alertService: AlertService,
    private router: Router
  ) {
    super();
    this.canEdit = this.ls.get('canEdit');
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.selectedSolicitud = this.ls.get('selectedSolicitud');

    if (this.canEdit) {
      if (this.selectedSolicitud.idSolicitud) {
        this.consultaSolicitudPorIdStorage(this.selectedSolicitud.idSolicitud);
        this.disabledComponent = this.selectedSolicitud.estatusId === 2237;
      }
      this.buildForm();
      this.establishAllSwitches(false);
    } else {
      this.router.navigate([
        '/Seguimiento/Seguimiento del Programa Anual de Actividades/Adecuaciones/Solicitudes',
      ]);
    }
  }

  buildForm(): void {
    this.questions = [
      new TextboxQuestion({
        nane: 'claveNombreUnidad',
        label: 'Clave y Nombre de la Unidad',
        value: `${this.dataUser.perfilLaboral.cveUnidad} ${this.dataUser.perfilLaboral.cdNombreUnidad}`,
        disabled: true,
        validators: [Validators.required, Validators.maxLength(200)],
      }),
    ];

    this.questions.push(
      new DropdownQuestion({
        nane: 'direccionGeneral',
        label: 'Dirección General',
        options: [],
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new DropdownQuestion({
        nane: 'tipoAdecuacion',
        label: 'Tipo de Adecuación',
        value: this.tipoAdecuacion,
        options: [],
        validators: [Validators.required, Validators.maxLength(200)],
      })
    );

    this.questions.push(
      new TextareaQuestion({
        nane: 'justificacion',
        label: 'Justificación',
        validators: [Validators.required, Validators.maxLength(800)],
      })
    );

    this.questions.push(
      new TextareaQuestion({
        nane: 'objetivo',
        label: 'Objetivo',
        validators: [Validators.required, Validators.maxLength(2000)],
      })
    );

    this.form = this._formBuilder.toFormGroup(this.questions);
    this.form.get('tipoAdecuacion')?.valueChanges.subscribe((value: number) => {
      this.tipoAdecuacion = value;
      this._alternSwitchService.setAdecuation(value);
      if (value === TIPO_ADECUACION.programatica) {
        this.enableProgramatics();
      }
      if (value === TIPO_ADECUACION.programaticaPresupuestal) {
        this.enableProgramaticsBudgets();
      }
      if (value === TIPO_ADECUACION.presupuestal) {
        this.enableOnlyBudgets();
      }
    });
    if (this.selectedSolicitud) {
      setTimeout(() => {
        this.uploadDataToForm(this.selectedSolicitud);
        if (this.onResponseSolicitud) {
          this.onResponseSolicitud.emit(this.selectedSolicitud);
        }
      }, 100);
    }
    if (this.disabledComponent) {
      this.form.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['catDireccionGeneralR']?.currentValue) {
      this.questions[1].options = mapCatalogData({
        data: this.catDireccionGeneralR,
      });
    }
    if (changes['catTipoAdecuacionR']?.currentValue) {
      this.questions[2].options = mapCatalogData({
        data: this.catTipoAdecuacionR,
      });
    }
  }

  consultaSolicitudPorIdStorage(idSolicitud: number) {
    this.solicitudSeguimientoService
      .consultaPorIdSolicitud(idSolicitud)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            this.selectedSolicitud = {
              ...value.respuesta,
            };
            if (this.selectedSolicitud.ibExisteInfo > 0) {
              this.disabledComponent = true;
              this.form.disable({ emitEvent: false });
            }
            this.ls.set('selectedSolicitud', this.selectedSolicitud);
            this.ls.set(
              'whatModuleStart',
              this.getWhatModuleInit(value.respuesta.adecuaciones)
            );
            if (this.onResponseSolicitud) {
              this.onResponseSolicitud.emit(this.selectedSolicitud);
            }
          }
        },
      });
  }

  submit(): void {
    if (this.data.folioSolicitud.includes('000')) {
      this._alertService.showAlert(
        'La Terminación del Folio debe ser Diferente de 000.'
      );
    } else if (this.data.folioSolicitud.split('-')[3].length !== 3) {
      this._alertService.showAlert(
        'La Terminación del Folio debe Contener 3 Caracteres.'
      );
    } else {
      if (this.form.valid) {
        this.isSubmiting = true;
        const { direccionGeneral, tipoAdecuacion, justificacion, objetivo } =
          this.form.getRawValue();
        const idUnidad = this.dataUser.perfilLaboral.idCatalogoUnidad;
        const adecuaciones = this.getAdecuaciones();
        const splitFechaSolicitud = this.data.fechaSolicitud
          ? this.data.fechaSolicitud?.split('/')
          : [];
        let fechaSolicitud = '';
        if (splitFechaSolicitud.length) {
          fechaSolicitud = `${splitFechaSolicitud[2]}-${splitFechaSolicitud[1]}-${splitFechaSolicitud[0]}`;
        }
        const dataPayload: IRegistrarSolicitudPayload = {
          ixFolioSecuencia: this.selectedSolicitud
            ? this.selectedSolicitud.ixFolioSecuencia
            : this.secuencialSeguimiento,
          folioSolicitud: this.data.folioSolicitud,
          fechaSolicitud,
          justificacion,
          objetivo,
          adecuacionId: tipoAdecuacion,
          direccionId: direccionGeneral,
          unidadId: idUnidad,
          anhioId: +this.yearNav,
          fechaAutorizacion: '',
          montoAplicacion: 0,
          modificacionId: 0,
          estatusId: getGlobalStatusSeguimiento('G', 'number'),
          usuario: this.dataUser.cveUsuario,
          adecuaciones: adecuaciones,
        };
        if (adecuaciones.length) {
          this.ls.set('whatModuleStart', this.getWhatModuleInit(adecuaciones));
        } else {
          this.ls.remove('whatModuleStart');
        }

        if (!this.selectedSolicitud?.idSolicitud) {
          this.solicitudSeguimientoService
            .registrarSolicitud(dataPayload)
            .pipe(takeUntil(this.notifier))
            .subscribe({
              next: (value) => {
                this.isSubmiting = false;
                if (value.codigo === '200') {
                  this._alertService.showAlert('Se Guardó Correctamente');
                  this.consultaSolicitudPorIdStorage(
                    value.respuesta.idSolicitud
                  );
                  if (this.onSaveSolicitud) {
                    this.onSaveSolicitud.emit();
                  }
                }
              },
              error: (err) => {
                this.isSubmiting = false;
              },
            });
        } else {
          this.solicitudSeguimientoService
            .actualizarSolicitud(
              this.selectedSolicitud.idSolicitud,
              dataPayload
            )
            .pipe(takeUntil(this.notifier))
            .subscribe({
              next: (value) => {
                this.isSubmiting = false;
                if (value.codigo === '200') {
                  this._alertService.showAlert('Se Actualizó Correctamente');
                  this.consultaSolicitudPorIdStorage(
                    this.selectedSolicitud.idSolicitud ?? 0
                  );
                }
              },
              error: (err) => {
                this.isSubmiting = false;
              },
            });
        }
      }
    }
  }

  getWhatModuleInit(adecuaciones: IAdecuacionesPayload[]): string {
    const findeProyecto = adecuaciones.filter(
      (item) => item.idTipoApartado === TIPO_APARTADO.proyecto
    );
    if (findeProyecto.length) {
      const findeProyectoAlta = findeProyecto[0].tiposModificaciones.filter(
        (item) => item.idTipoModificacion === MODIFICATION_TYPE.alta
      );
      if (findeProyectoAlta.length) {
        return 'proyects';
      }
    }
    const findeActividad = adecuaciones.filter(
      (item) => item.idTipoApartado === TIPO_APARTADO.actividades
    );
    if (findeActividad.length) {
      const findeActividadAlta = findeActividad[0].tiposModificaciones.filter(
        (item) => item.idTipoModificacion === MODIFICATION_TYPE.alta
      );
      if (findeActividadAlta.length) {
        return 'activities';
      }
    }
    const findeProducto = adecuaciones.filter(
      (item) => item.idTipoApartado === TIPO_APARTADO.productos
    );
    if (findeProducto.length) {
      const findeProductoAlta = findeProducto[0].tiposModificaciones.filter(
        (item) => item.idTipoModificacion === MODIFICATION_TYPE.alta
      );
      if (findeProductoAlta.length) {
        return 'products';
      }
    }
    const findeActions = adecuaciones.filter(
      (item) => item.idTipoApartado === TIPO_APARTADO.acciones
    );
    if (findeActions.length) {
      const findeActionsAlta = findeActions[0].tiposModificaciones.filter(
        (item) => item.idTipoModificacion === MODIFICATION_TYPE.alta
      );
      if (findeActionsAlta.length) {
        return 'actions';
      }
    }
    const findeBudgets = adecuaciones.filter(
      (item) => item.idTipoApartado === TIPO_APARTADO.presupuesto
    );
    if (findeBudgets.length) {
      const findeBudgetsAlta = findeBudgets[0].tiposModificaciones.filter(
        (item) => item.idTipoModificacion === MODIFICATION_TYPE.alta
      );
      if (findeBudgetsAlta.length) {
        return 'budgets';
      }
    }
    return '';
  }

  getAdecuaciones(): IAdecuacionesPayload[] {
    const tmpListAdecuacion: IAdecuacionesPayload[] = [];
    for (const item of this.switches) {
      let flag = false;
      const tmpSons: any[] = [];
      for (const key in item) {
        if (Object.hasOwn(item, key)) {
          const element = item[key];
          if (!flag && typeof element === 'object' && element.value) {
            flag = true;
          }
          if (typeof element === 'object' && element.value) {
            tmpSons.push({
              idTipoModificacion: element.id,
            });
          }
        }
      }

      if (flag) {
        tmpListAdecuacion.push({
          idTipoApartado: item.id,
          tiposModificaciones: tmpSons,
        });
      }
    }
    return tmpListAdecuacion;
  }

  uploadDataToForm(data: IItemConsultaSolicitudResponse) {
    this.form.get('direccionGeneral')?.setValue(data.direccionId ?? '');
    this.form.get('tipoAdecuacion')?.setValue(data.adecuacionId ?? '');
    this.form.get('justificacion')?.setValue(data.justificacion ?? '');
    this.form.get('objetivo')?.setValue(data.objetivo ?? '');
    for (const item of this.switches) {
      const finded = data.adecuaciones.filter(
        (itemFilter) => itemFilter.idTipoApartado === item.id
      );
      if (finded.length) {
        let elementId = 0;
        for (const key in item) {
          if (Object.hasOwn(item, key)) {
            const element = item[key];
            if (key === 'id') {
              elementId = element;
            }

            if (typeof element === 'object') {
              const findedHijo = finded[0].tiposModificaciones.filter(
                (itemFilter) => itemFilter.idTipoModificacion === element.id
              );
              if (findedHijo.length) {
                element.value = true;
                if (elementId === 2221) {
                  element.enable = true;
                }
              }
            }
          }
        }
      }
    }
  }
}
