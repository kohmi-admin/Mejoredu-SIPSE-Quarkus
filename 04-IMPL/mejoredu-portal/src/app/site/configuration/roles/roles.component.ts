import { Component, OnDestroy } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { IRolesResponse } from '@common/interfaces/configuration/roles.interface';
import { TableActionsI, TableConsts } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';
import { RolesService } from '@common/services/configuration/roles.service';
import { TableItemI } from '@common/table-item/interface/table-item.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss', '../configuration.component.scss']
})
export class RolesComponent {
  editable: boolean = true;
  columns: TableColumn[] = [
    { columnDef: 'name', header: 'Nombre', alignLeft: true },
  ];
  actions: TableActionsI | undefined = {
    view: true,
    edit: true,
    delete: true,
  }
  validation: boolean = false;
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  data: any[] = [];
  isView: boolean = false;
  updateForm: boolean = false;
  dataSelected: IRolesResponse | undefined;

  constructor(
    private _formBuilder: QuestionControlService,
    private _alertService: AlertService,
    private rolesService: RolesService
  ) {

    this.questions = [
      new TextboxQuestion({
        nane: 'nameRole',
        label: 'Nombre del Rol',
        validators: [Validators.required, Validators.maxLength(100)],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
    this.getData();
  }
  getData() {
    this.rolesService.getAllRoles().subscribe({
      next: (value) => {
        this.data = value.map((tipoUsuario) => ({
          id: tipoUsuario.idTipoUsuario,
          name: tipoUsuario.cdtipoUsuario,
          ...tipoUsuario
        })).sort((a, b) => a.name.localeCompare(b.name));;
      }
    });
  }

  submit() {
    const { nameRole } = this.form.getRawValue();
    this.rolesService.createRole(
      {
        cdtipoUsuario: nameRole,
        csEstatus: 'A',
        idBitacora: -1
      }
    ).subscribe({
      next: (value) => {
        this.getData();
        this.resetAllForm();
        this._alertService.showAlert('Se Guardó Correctamente');
      },
      error: (error) => {
      },
    });
  }

  update(){
    const { nameRole } = this.form.getRawValue();
    this.rolesService.updateRole(this.dataSelected?.idTipoUsuario,
      {
        cdtipoUsuario: nameRole,
        csEstatus: 'A',
        idBitacora: -1
      }
    ).subscribe({
      next: (value) => {
        this.getData();
        this.resetAllForm();
        this._alertService.showAlert('Se Actualizó Correctamente');
      },
      error: (error) => {
      },
    });
  }

  async onTableAction(event: TableButtonAction) {
    const dataAction: IRolesResponse = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.resetAllForm();
        this.form.controls['nameRole'].setValue(dataAction.cdtipoUsuario);
        this.form.disable();
        this.updateForm = false;
        this.isView = true;
        break;
      case TableConsts.actionButton.edit:
        this.form.enable();
        this.resetAllForm();
        this.form.controls['nameRole'].setValue(dataAction.cdtipoUsuario);
        this.dataSelected = dataAction;
        this.updateForm = true;
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation(
            { message: '¿Está Seguro de Eliminar el Rol?' });
          if (confirm) {
            this.rolesService
              .deleteRole(dataAction.idTipoUsuario)
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this._alertService.showAlert('Se Eliminó Correctamente');
                    this.getData();
                    this.resetAllForm();
                  }
                },
                error: (err) => { },
              });
          }
        }
        break;
    }
  }

  resetAllForm() {
    this.updateForm = false;
    this.isView = false;
    this.form.reset();
  }

  newRole(){
    this.form.enable();
    this.resetAllForm();
  }
}
