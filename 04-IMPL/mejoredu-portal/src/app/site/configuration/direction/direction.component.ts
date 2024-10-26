import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonStructure } from '@common/classes/common-structure.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { IItemDireccion } from '@common/interfaces/configuration/direcciones.interface';
import { IItemUnidad } from '@common/interfaces/configuration/unidades.interface';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { TableConsts } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';
import { DireccionesService } from '@common/services/configuration/direcciones.service';
import { UnidadesService } from '@common/services/configuration/unidades.service';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-direction',
  templateUrl: './direction.component.html',
  styleUrls: ['../configuration.component.scss', './direction.component.scss'],
})
export class DirectionComponent extends CommonStructure {
  ls = new SecureLS({ encodingType: 'aes' });
  editable: boolean = true;
  override columns: TableColumn[] = [
    { columnDef: 'unidad', header: 'Unidad', alignLeft: true },
    { columnDef: 'direccion', header: 'Dirección General', alignLeft: true },
  ];
  dataUser: IDatosUsuario;
  isView: boolean = false;
  updateForm: boolean = false;
  dataSelected: any | undefined;

  listUnidades: IItemUnidad[] = [];

  ccExternaDireccion: number = 0;

  constructor(
    private _formBuilder: QuestionControlService,
    _alertService: AlertService,
    private unidadService: UnidadesService,
    private direccionesService: DireccionesService
  ) {
    super(_alertService);
    this.dataUser = this.ls.get('dUaStEaR');
    this.buildForm();
    this.getData();
  }

  buildForm() {
    this.dataUser = this.ls.get('dUaStEaR');
    this.questions = [
      new DropdownQuestion({
        nane: 'unidad',
        label: 'Unidad',
        filter: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),

      new TextboxQuestion({
        nane: 'direccion',
        label: 'Dirección General',
        validators: [Validators.required, Validators.maxLength(100)],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  getData() {
    this.getUnidades();
  }

  getUnidades() {
    this.unidadService.consultarActivos().subscribe({
      next: (value) => {
        this.questions[0].options = value.catalogo.map((item) => ({
          id: item.idCatalogo,
          value: item.cdOpcion,
          ...item,
        }));
        this.listUnidades = value.catalogo;
        this.getDirecciones();
      },
    });
  }

  getDirecciones() {
    this.direccionesService.listarDirecciones().subscribe({
      next: (value) => {
        this.data = value.respuesta.map((item) => ({
          unidad:
            this.listUnidades.filter(
              (itemUnidad) => String(itemUnidad.idCatalogo) == item.ccExternados
            )[0]?.cdOpcion ?? 'Unidad no encontrada',
          direccion: item.cdOpcion,
          ...item,
        }));
        this.getCcExterna();
      },
    });
  }

  submit() {
    const { unidad, direccion } = this.form.getRawValue();
    if(!direccion || !direccion.trim()){
      this._alertService.showAlert('Ingrese el nombre de la dirección para continuar', 'Datos incorrectos');
    } else {
      this.direccionesService
      .agregarDireccion({
        cdOpcion: direccion,
        cveUsuario: this.dataUser.cveUsuario,
        ccExterna: null, //FIX: Agregar ccExterna
        ccExternaDos: unidad,
      })
      .subscribe({
        next: (value) => {
          if(value.codigo == "200") {
            this.getData();
            this.clean();
            this._alertService.showAlert('Se Guardó Correctamente');
          }
        },
      });
    }
  }

  update() {
    const { unidad, direccion } = this.form.getRawValue();
    if(!direccion || !direccion.trim()){
      this._alertService.showAlert('Ingrese el nombre de la dirección para continuar', 'Datos incorrectos');
    } else {
      this.direccionesService
      .actualizarDirecciones(this.dataSelected?.idCatalogo, {
        cdOpcion: direccion,
        cveUsuario: this.dataUser.cveUsuario,
        ccExterna: null, //FIX: Agregar ccExterna
        ccExternaDos: unidad,
      })
      .subscribe({
        next: (value) => {
          if(value.codigo == "200") {
            this.getData();
            this.clean();
            this._alertService.showAlert('Se Actualizó Correctamente');
          }
        },
      });
    }
  }

  override async onTableAction(event: TableButtonAction) {
    const dataAction: IItemDireccion = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.clean();
        this.form.patchValue(event.value);
        this.disableForm();
        this.isView = true;
        this.form.controls['unidad'].setValue( parseInt(dataAction.ccExternados) );
        break;
      case TableConsts.actionButton.edit:
        this.clean();
        this.form.patchValue(event.value);
        this.enableForm();
        this.updateForm = true;
        this.dataSelected = dataAction;
        this.form.controls['unidad'].setValue( parseInt(dataAction.ccExternados) );
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation({
            message: '¿Está Seguro de Eliminar el Registro?',
          });
          if (confirm) {
            this.direccionesService
              .eliminarDireccion(dataAction.idCatalogo)
              .subscribe({
                next: (value) => {
                  if (value.codigo == '200') {
                    this.data = [
                      ...this.data.filter(
                        (item) => item.idCatalogo !== dataAction.idCatalogo
                      ),
                    ];
                    this.clean();
                    this._alertService.showAlert('Se Eliminó Correctamente');
                  }
                },
              });
          }
        }
        break;
    }
  }

  clean() {
    this.updateForm = false;
    this.isView = false;
    this.form.reset();
    this.form.enable();
    this.getCcExterna();
  }

  getCcExterna() {
    let dataFilterNull = this.data.filter((item) => item.ccExterna != null);
    this.ccExternaDireccion =
      parseInt(dataFilterNull[dataFilterNull.length - 1]?.ccExterna) + 1;
  }
}
