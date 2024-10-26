import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { StateViewService } from '../../../services/state-view.service';
import { CommonStructure } from '../classes/common-structure.class';
import { TableColumn } from '@common/models/tableColumn';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import * as SecureLS from 'secure-ls';
import { Subject, forkJoin, take, takeUntil } from 'rxjs';
import { ModalService } from '@common/modal/modal.service';
import { CatalogsService } from '@common/services/catalogs.service';
import { environment } from 'src/environments/environment';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import {
  IGestorPayload,
  IItemGestorEstructuraResponse,
} from '@common/interfaces/medium-term/principal.interface';
import { PrincipalService } from '@common/services/medium-term/principal.service';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableConsts } from '@common/mat-custom-table/consts/table';
import { AlertService } from '@common/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss', '../structure.component.scss'],
})
export class PrincipalComponent extends CommonStructure {
  ls = new SecureLS({ encodingType: 'aes' });
  notifier = new Subject();
  loading: boolean = false;
  disabledSubmiting: boolean = false;
  isSubmiting: boolean = false;
  dataSelected: IItemGestorEstructuraResponse | undefined;
  isCleanForm: boolean = false;
  yearNav: string;
  viewType: 'registro' | 'consulta' | 'actualizacion' | 'validar' = 'registro';
  idSaveValidar: number = 0;
  selectedValidatePI: any = null;
  selectedAjustesPI: any = null;
  canEdit: boolean = true;

  override columns: TableColumn[] = [
    {
      columnDef: 'nombreProgramaInstitucional',
      header: 'Nombre del Programa Institucional',
      alignLeft: true,
    }, //FIX: Cambiar por problemas
    { columnDef: 'estatus', header: 'Estatus', width: '110px' },
  ];

  dataUser: IDatosUsuario;

  constructor(
    private _formBuilder: QuestionControlService,
    private _stateViewService: StateViewService,
    private catalogService: CatalogsService,
    private principalService: PrincipalService,
    private router: Router,
    public modalService: ModalService,
    // private alertService: AlertService,
    private _alertService: AlertService
  ) {
    super();
    this.selectedValidatePI = this.ls.get('selectedValidatePI');
    this.selectedAjustesPI = this.ls.get('selectedAjustesPI');
    this.canEdit = this.ls.get('canEdit');
    this.whatViewIs();
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.createQuestions();
    this.getAll();
    this.getGestorPorAnhio();
  }

  whatViewIs() {
    const url: string = this.router.url;
    if (url.includes('Consulta/Inicio')) {
      this.viewType = 'consulta';
    } else if (url.includes('Actualizaci%C3%B3n/Inicio')) {
      this.viewType = 'actualizacion';
    } else if (url.includes('Registro/Inicio')) {
      this.viewType = 'registro';
    } else if (url.includes('Validar')) {
      this.viewType = 'validar';
    }
    this.ls.set('recordViewType', this.viewType);
  }

  getGestorPorAnhio() {
    this.principalService
      .getGestorPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta) {
            if (value.respuesta.estatus === 'O') {
              this.canEdit = false;
              this._alertService.showAlert('La Estructura está Aprobada.');
            } else if (
              this.canEdit &&
              value.respuesta.estatus !== 'C' &&
              value.respuesta.estatus !== 'I' &&
              !this.selectedValidatePI &&
              !this.selectedAjustesPI
            ) {
              this.canEdit = false;
              if (value.respuesta.estatus !== 'T') {
                this._alertService.showAlert(
                  'La Estructura está en Proceso de Validación, para Modificarla Vaya a Ajustes.'
                );
              }
            }
            this.onTableAction({ name: 'view', value: value.respuesta });
            this.validateWhereComeFrom();
          }
        },
        error: (error) => { },
      });
  }

  getActionsTable() {
    const actionsTmp = {
      ...this.actions,
    };
    if (this.viewType === 'consulta' || this.viewType === 'validar') {
      actionsTmp.edit = false;
      actionsTmp.delete = false;
    }
    return actionsTmp;
  }

  createQuestions() {
    this.questions = [
      new TextboxQuestion({
        idElement: 1,
        nane: 'nombreProgramaInstitucional',
        label: 'Nombre del Programa Institucional',
        icon: 'help',
        message: 'Alfanumérico, 100 Caracteres de Longitud',
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new DropdownQuestion({
        idElement: 2,
        nane: 'alineacionPND',
        label: 'Alineación al PND',
        filter: true,
        options: [
          {
            id: 1,
            value: 'Opción 1',
          },
        ],
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextareaQuestion({
        idElement: 3,
        nane: 'analisisEstadoActual',
        label: 'Análisis del Estado Actual',
        icon: 'help',
        message: 'Alfanumérico, 4000 Caracteres de Longitud',
        validators: [Validators.required, Validators.maxLength(4000)],
      }),

      new TextareaQuestion({
        idElement: 4,
        nane: 'problemasPublicos',
        label: 'Problemas Públicos',
        icon: 'help',
        message: 'Alfanumérico, 4000 Caracteres de Longitud',
        validators: [Validators.required, Validators.maxLength(4000)],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    if (!this._stateViewService.editable) {
      this.form.disable();
    }
    this.validation = this._stateViewService.validation;
  }

  async getAll() {
    this.loading = true;
    this.getCatalogs();
    this.loading = false;
  }

  getCatalogs() {
    forkJoin([
      this.catalogService.getCatalogById(
        environment.endpoints.catalogs['alineacionPND']
      ),
    ])
      .pipe(take(1))
      .subscribe(([dataAlineacionPND]) => {
        this.questions[1].options = mapCatalogData({
          data: dataAlineacionPND,
        });
      });
  }

  validateWhereComeFrom() {
    if (this.selectedValidatePI) {
      if (
        !this.questions[1].optionsArray ||
        this.questions[1].optionsArray.length === 0
      ) {
        setTimeout(() => {
          this.validateWhereComeFrom();
        }, 500);
      } else {
        this.idSaveValidar = this.selectedValidatePI.value.idPrograma;
        this.onTableAction(this.selectedValidatePI);
      }
    } else if (this.selectedAjustesPI) {
      this.idSaveValidar = this.selectedAjustesPI.value.idPrograma;
    }
  }

  submit() {
    const {
      nombreProgramaInstitucional,
      alineacionPND,
      analisisEstadoActual,
      problemasPublicos,
    } = this.form.getRawValue();
    if (this.form.valid) {
      this.isSubmiting = true;
      if (!this.dataSelected) {
        const dataCreateGestor: IGestorPayload = {
          nombre: nombreProgramaInstitucional,
          alineacion: alineacionPND || 0,
          analisis: analisisEstadoActual,
          problemas: problemasPublicos,
          usuario: this.dataUser.cveUsuario,
          estatus: this.form.valid ? 'C' : 'I',
          anhioPlaneacion: +this.yearNav,
        };
        this.principalService
          .createGestorEstructura(dataCreateGestor)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmiting = false;

              if (value.mensaje.codigo === '200') {
                this.getGestorPorAnhio();
                this.dataSelected = undefined;
                this.modalService.openGenericModal({
                  idModal: 'modal-disabled',
                  component: 'generic',
                  data: {
                    text: 'Se guardó correctamente.',
                    labelBtnPrimary: 'Aceptar',
                  },
                });
              }
            },
            error: (error) => {
              this.isSubmiting = false;
            },
          });
      } else {
        const dataUpdateGestor: IGestorPayload = {
          nombre: nombreProgramaInstitucional,
          alineacion: alineacionPND || 0,
          analisis: analisisEstadoActual,
          problemas: problemasPublicos,
          usuario: this.dataUser.cveUsuario,
          estatus: this.form.valid ? 'C' : 'I',
          anhioPlaneacion: +this.yearNav,
        };
        this.principalService
          .updateGestorEstructura(
            this.dataSelected.idPrograma,
            dataUpdateGestor
          )
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmiting = false;
              if (value.mensaje.codigo === '200') {
                this.getGestorPorAnhio();
                this.modalService.openGenericModal({
                  idModal: 'modal-disabled',
                  component: 'generic',
                  data: {
                    text: 'Se modificó correctamente.',
                    labelBtnPrimary: 'Aceptar',
                  },
                });
              } else {
                this.modalService.openGenericModal({
                  idModal: 'modal-disabled',
                  component: 'generic',
                  data: {
                    text: 'Error al modificar, intente más tarde.',
                    labelBtnPrimary: 'Aceptar',
                  },
                });
              }
            },
            error: (error) => {
              this.isSubmiting = false;
            },
          });
      }
    }
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: IItemGestorEstructuraResponse = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view: {
        this.resetAllForm();
        this.isCleanForm = true;
        this.dataSelected = dataAction;
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.form.disable();
          this.disabledSubmiting = true;
        }, 100);
        break;
      }
      case TableConsts.actionButton.edit: {
        this.dataSelected = dataAction;
        this.resetAllForm();
        this.isCleanForm = true;
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.form.enable();
          this.disabledSubmiting = false;
        }, 100);
        break;
      }
      case TableConsts.actionButton.delete: {
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar el Objetivo?',
          });
          if (confirm) {
            this.principalService
              .deleteGestorEstructura(
                String(dataAction.idPrograma),
                this.dataUser.cveUsuario
              )
              .pipe(takeUntil(this.notifier))
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this.modalService.openGenericModal({
                      idModal: 'modal-disabled',
                      component: 'generic',
                      data: {
                        text: 'Se eliminó correctamente.',
                        labelBtnPrimary: 'Aceptar',
                      },
                    });
                    this.getGestorPorAnhio();
                    this.newGestor();
                  }
                },
                error: (err) => { },
              });
          }
        }
        break;
      }
    }
  }

  uploadDataToForm(dataAction: IItemGestorEstructuraResponse) {
    this.form.controls['nombreProgramaInstitucional'].setValue(
      dataAction.nombrePrograma
    );
    this.form.controls['alineacionPND'].setValue(dataAction.alineacionPND);
    this.form.controls['analisisEstadoActual'].setValue(dataAction.analisis);
    this.form.controls['problemasPublicos'].setValue(
      dataAction.programasPublicos
    );
  }

  onEdit() {
    this.form.enable();
    this.disabledSubmiting = false;
  }

  newGestor() {
    this.resetAllForm();
    this.form.enable();
    this.isCleanForm = false;
    this.dataSelected = undefined;
  }

  resetAllForm() {
    this.form.reset();
    this.disabledSubmiting = false;
  }

  ngOnDestroy() {
    this.notifier.complete();
  }
}
