import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonStructure } from '@common/classes/common-structure.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { IItemUnidad } from '@common/interfaces/configuration/unidades.interface';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { TableConsts } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';
import { UnidadesService } from '@common/services/configuration/unidades.service';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-unidades',
  templateUrl: './unidades.component.html',
  styleUrls: ['../configuration.component.scss', './unidades.component.scss',]
})
export class UnidadesComponent extends CommonStructure {
  ls = new SecureLS({ encodingType: 'aes' });
  editable: boolean = true;
  override columns: TableColumn[] = [
    { columnDef: 'claveUnidad', header: 'Clave', width: '90px' },
    { columnDef: 'nombreUnidad', header: 'Nombre', alignLeft: true },
  ]

  dataUser: IDatosUsuario;
  isView: boolean = false;
  updateForm: boolean = false;
  dataSelected: IItemUnidad | undefined;

  constructor(
    private _formBuilder: QuestionControlService,
    override _alertService: AlertService,
    private unidadService: UnidadesService
  ) {
    super(_alertService);
    this.dataUser = this.ls.get('dUaStEaR');
    this.buildForm();
    this.getData();
  }

  buildForm() {
    this.questions = [
      new TextboxQuestion({
        nane: 'claveUnidad',
        label: 'Clave',
        disabled: true,
        value: this.data.length + 1,
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextboxQuestion({
        nane: 'nombreUnidad',
        label: 'Nombre de la Unidad',
        validators: [Validators.required, Validators.maxLength(100)],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  getData() {
    this.unidadService.consultarActivos()
      .subscribe({
        next: (value) => {
          this.data = value.catalogo.map((item) => ({
            claveUnidad: item.ccExterna,
            nombreUnidad: item.cdOpcion,
            ...item
          }))
          this.form.controls['claveUnidad'].setValue(parseInt(this.data[this.data.length-1].claveUnidad)+1)
        }
      })
  }

  submit() {
    const { claveUnidad, nombreUnidad } = this.form.getRawValue();
    if(!nombreUnidad || !nombreUnidad.trim()){
      this._alertService.showAlert('Ingrese el nombre de la unidad para continuar', 'Datos incorrectos');
    } else {
      this.unidadService.agregarUnidad({
        cdOpcion: nombreUnidad,
        cveUsuario: this.dataUser.cveUsuario,
        ccExterna: claveUnidad
      }).subscribe({
        next: (value) => {
          if(value.codigo == "200") {
            this.getData();
            this.clean();
            this._alertService.showAlert('Se Guardó Correctamente');
          }
        }
      })
    }
  }

  update(){
    const { claveUnidad, nombreUnidad } = this.form.getRawValue();
    if(!nombreUnidad || !nombreUnidad.trim()){
      this._alertService.showAlert('Ingrese el nombre de la unidad para continuar', 'Datos incorrectos');
    } else {
      this.unidadService.actualizarUnidad(this.dataSelected?.idCatalogo, {
        idCatalogo: this.dataSelected?.idCatalogo,
        cdOpcion: nombreUnidad,
        ccExterna: claveUnidad
      }).subscribe({
        next: (value) => {
          if(value.mensaje.codigo == "200") {
            this.getData();
            this.clean();
            this._alertService.showAlert('Se Actualizó Correctamente');
          }
        }
      })
    }
  }

  override async onTableAction(event: TableButtonAction) {
    const dataAction: IItemUnidad = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.clean();
        this.form.patchValue(event.value);
        this.disableForm();
        this.isView = true;
        break;
      case TableConsts.actionButton.edit:
        this.clean();
        this.form.patchValue(event.value);
        this.enableForm();
        this.form.get('claveUnidad')?.disable();
        this.updateForm = true;
        this.dataSelected = dataAction;
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation(
            { message: '¿Está Seguro de Eliminar el Registro?' });
          if (confirm) {
            this.unidadService.eliminarUnidad(dataAction.idCatalogo)
              .subscribe({
                next: (value) => {
                  if(value.mensaje.codigo == "200"){
                    this.data = [
                      ...this.data.filter((item) => item.idCatalogo !== dataAction.idCatalogo),
                    ];
                    this.clean();
                    this._alertService.showAlert('Se Eliminó Correctamente');
                  }
                }
              })

          }
        }
        break;
    }
  }

  clean(){
    this.updateForm = false;
    this.isView = false;
    this.form.reset();
    this.form.get('claveUnidad')?.disable();
    this.form.get('nombreUnidad')?.enable();
    this.form.controls['claveUnidad'].setValue(parseInt(this.data[this.data.length-1].claveUnidad)+1)
  }
}
