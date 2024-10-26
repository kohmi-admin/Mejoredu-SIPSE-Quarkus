import { Component } from '@angular/core';
import { CommonStructure } from '../classes/common-structure.class';
import { TableColumn } from '@common/models/tableColumn';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { Validators } from '@angular/forms';
import { StateViewService } from '../../../services/state-view.service';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { GoalsService } from '@common/services/goals.service';
import { Subject, takeUntil } from 'rxjs';
import { TableConsts } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import {
  IGoalPayload,
  IItemGoalResponse,
} from '@common/interfaces/goals.interface';
import { AlertService } from '@common/services/alert.service';
import { ModalService } from '@common/modal/modal.service';
import * as SecureLS from 'secure-ls';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { PrincipalService } from '@common/services/medium-term/principal.service';
import { IGestorResponse } from '@common/interfaces/medium-term/principal.interface';

@Component({
  selector: 'app-priority-objectives',
  templateUrl: './priority-objectives.component.html',
  styleUrls: [
    './priority-objectives.component.scss',
    '../structure.component.scss',
  ],
})
export class PriorityObjectivesComponent extends CommonStructure {
  ls = new SecureLS({ encodingType: 'aes' });
  notifier = new Subject();
  disabledSubmiting: boolean = false;
  isSubmiting: boolean = false;
  dataSelected: IItemGoalResponse | undefined;
  dataUser: IDatosUsuario;
  isCleanForm: boolean = false;
  viewType: 'registro' | 'consulta' | 'actualizacion' | 'validar' = 'registro';
  idSaveValidar: number = 0;
  selectedValidatePI: any = null;
  selectedAjustesPI: any = null;
  canEdit: boolean = true;
  yearNav: string;
  dataEstructura!: IGestorResponse;

  override columns: TableColumn[] = [
    { columnDef: 'cdObjetivo', header: 'Objetivo', alignLeft: true },
    {
      columnDef: 'relevancia',
      header: 'Relevancia del Objetivo',
      alignLeft: true,
    },
  ];

  constructor(
    private _formBuilder: QuestionControlService,
    private _stateViewService: StateViewService,
    private goalsService: GoalsService,
    private alertService: AlertService,
    public modalService: ModalService,
    private principalService: PrincipalService
  ) {
    super();
    this.selectedValidatePI = this.ls.get('selectedValidatePI');
    this.selectedAjustesPI = this.ls.get('selectedAjustesPI');
    this.canEdit = this.ls.get('canEdit');
    this.viewType = this.ls.get('recordViewType');
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    this.questions = [
      new TextboxQuestion({
        idElement: 5,
        nane: 'numero',
        label: 'Número',
        type: 'number',
        value: 0,
        disabled: true,
        validators: [Validators.required],
      }),
      new TextboxQuestion({
        idElement: 6,
        nane: 'objetivos',
        label: 'Objetivo',
        icon: 'help',
        rows: 4,
        message: 'Alfanumérico, 500 Caracteres de Longitud',
        validators: [Validators.required, Validators.maxLength(500)],
      }),
      new TextareaQuestion({
        idElement: 7,
        nane: 'relevancia',
        label: 'Relevancia del Objetivo',
        icon: 'help',
        message: 'Alfanumérico, 3400 Caracteres de Longitud',
        validators: [Validators.required, Validators.maxLength(3400)],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    if (!this._stateViewService.editable || !this.canEdit) {
      this.form.disable();
    }
    this.validation = this._stateViewService.validation;
    this.getGestorPorAnhio();
  }

  getGestorPorAnhio() {
    this.principalService
      .getGestorPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200' && value.respuesta) {
            this.dataEstructura = value.respuesta;
            if (value.respuesta.estatus === 'O') {
              this.canEdit = false;
              this.alertService.showAlert('La Estructura está Aprobada.');
            } else if (
              this.canEdit &&
              value.respuesta.estatus !== 'C' &&
              value.respuesta.estatus !== 'I' &&
              !this.selectedValidatePI &&
              !this.selectedAjustesPI
            ) {
              this.canEdit = false;
              if (value.respuesta.estatus !== 'T') {
                this.alertService.showAlert(
                  'La Estructura está en Proceso de Validación, para Modificarla Vaya a Ajustes.'
                );
              }
            }
          }
          this.getGoals();
        },
      });
  }

  getActionsTable = () => {
    const actionsTmp = {
      ...this.actions,
    };
    if (
      this.viewType === 'consulta' ||
      this.viewType === 'validar' ||
      !this.canEdit
    ) {
      actionsTmp.edit = false;
      actionsTmp.delete = false;
    }
    return actionsTmp;
  };

  setNumberForm() {
    const arrKeys: any[] = [0];
    for (const item of this.data) {
      arrKeys.push(item.ixObjetivo);
    }
    const mayor = Math.max(...arrKeys);
    this.form.get('numero')?.setValue(mayor + 1);
  }

  getGoals() {
    this.goalsService
      .getGoals()
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            this.data = value.respuesta;
            this.setNumberForm();
          }
        },
      });
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: IItemGoalResponse = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.resetAllForm();
        this.isCleanForm = true;
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.form.disable();
          this.disabledSubmiting = true;
          if (
            this.viewType === 'validar' ||
            this.viewType === 'actualizacion'
          ) {
            this.validateWhereComeFrom(dataAction.idObjetivo);
          }
        }, 100);
        break;
      case TableConsts.actionButton.edit:
        this.dataSelected = dataAction;
        this.resetAllForm();
        this.isCleanForm = true;
        setTimeout(() => {
          this.uploadDataToForm(dataAction);
          this.form.enable();
          this.form.get('numero')?.disable();
          this.disabledSubmiting = false;
          if (
            this.viewType === 'validar' ||
            this.viewType === 'actualizacion'
          ) {
            this.validateWhereComeFrom(dataAction.idObjetivo);
          }
        }, 100);
        break;
      case TableConsts.actionButton.delete: {
        {
          const confirm = await this.alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar el Objetivo?',
          });
          if (confirm) {
            this.goalsService
              .deleteGoal(
                String(dataAction.idObjetivo),
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
                    this.getGoals();
                    this.newGoal();
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

  validateWhereComeFrom(idSave: number) {
    this.idSaveValidar = idSave;
  }

  async submit() {
    const { numero, objetivos, relevancia } = this.form.getRawValue();

    if (this.form.valid) {
      this.isSubmiting = true;
      if (!this.dataSelected) {
        const dataCreateGoal: IGoalPayload = {
          idObjetivo: 0,
          ixObjetivo: numero,
          cdObjetivo: objetivos,
          relevancia: relevancia,
          usuario: this.dataUser.cveUsuario,
          idEstructura: this.dataEstructura.idPrograma,
        };
        this.goalsService
          .createGoal(dataCreateGoal)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmiting = false;
              if (value.mensaje.codigo === '200') {
                this.getGoals();
                this.resetAllForm();
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
        const dataUpdateProyecto: IGoalPayload = {
          idObjetivo: this.dataSelected.idObjetivo,
          ixObjetivo: numero,
          cdObjetivo: objetivos,
          relevancia: relevancia,
          usuario: this.dataUser.cveUsuario,
          idEstructura: this.dataEstructura.idPrograma,
        };

        this.goalsService
          .updateGoal(dataUpdateProyecto)
          .pipe(takeUntil(this.notifier))
          .subscribe({
            next: (value) => {
              this.isSubmiting = false;
              if (value.mensaje.codigo === '200') {
                this.getGoals();
                this.newGoal();
                this.dataSelected = undefined;
                this.modalService.openGenericModal({
                  idModal: 'modal-disabled',
                  component: 'generic',
                  data: {
                    text: 'Se modificó correctamente.',
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

  newGoal() {
    this.resetAllForm();
    this.form.enable();
    this.form.get('numero')?.disable();
    this.dataSelected = undefined;
    this.setNumberForm();
    this.isCleanForm = false;
  }

  resetAllForm() {
    this.form.reset();
    this.disabledSubmiting = false;
  }

  uploadDataToForm(dataAction: IItemGoalResponse) {
    this.form.controls['numero'].setValue(dataAction.ixObjetivo);
    this.form.controls['objetivos'].setValue(dataAction.cdObjetivo);
    this.form.controls['relevancia'].setValue(dataAction.relevancia);
  }

  ngOnDestroy() {
    this.notifier.complete();
  }
}
