import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonStructure } from '@common/classes/common-structure.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { IItemUnidad } from '@common/interfaces/configuration/unidades.interface';
import { IUsuarioPayload } from '@common/interfaces/configuration/usuarios.interface';
import { IReporteAcceso } from '@common/interfaces/excel/reporte-acceso.interface';
import { mapCatalogData } from '@common/mapper/catalog.mapper';
import { TableConsts } from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';
import { CatalogsService } from '@common/services/catalogs.service';
import { DireccionesService } from '@common/services/configuration/direcciones.service';
import { RolesService } from '@common/services/configuration/roles.service';
import { UnidadesService } from '@common/services/configuration/unidades.service';
import { UsuariosService } from '@common/services/configuration/usuarios.service';
import { ExcelJsService } from '@common/services/exceljs.service';
import { empty, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['../configuration.component.scss', './usuarios.component.scss'],
})
export class UsuariosComponent extends CommonStructure {
  editable: boolean = true;
  override columns: TableColumn[] = [
    { columnDef: 'name', header: 'Nombre del Usuario', alignLeft: true },
    { columnDef: 'unidadString', header: 'Unidad', alignLeft: true },
    { columnDef: 'rolU', header: 'Rol', alignLeft: true },
    { columnDef: 'status', header: 'Estatus', alignLeft: true },
  ];

  dataReport: IReporteAcceso[] = [];
  reportType: 'alta' | 'cancelacion' = 'cancelacion';

  isView: boolean = false;
  updateForm: boolean = false;
  dataSelected!: IUsuarioPayload;

  dataUnidad: any;
  dataRoles: any;

  listUnidades: IItemUnidad[] = [];

  constructor(
    private _formBuilder: QuestionControlService,
    private alertService: AlertService,
    private excelJsService: ExcelJsService,
    private unidadService: UnidadesService,
    private direccionesService: DireccionesService,
    private rolesService: RolesService,
    private usuariosService: UsuariosService
  ) {
    super(alertService);
    this.createForm();
    this.getData();
  }

  createForm() {
    this.questions = [
      new TextboxQuestion({
        nane: 'nombre',
        label: 'Nombre',
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      new TextboxQuestion({
        nane: 'primerApellido',
        label: 'Apellido Paterno',
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      new TextboxQuestion({
        nane: 'segundoApellido',
        label: 'Apellido Materno',
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      new TextboxQuestion({
        nane: 'email',
        label: 'Email',
        validators: [Validators.required, Validators.email],
      }),
      new DropdownQuestion({
        nane: 'unidad',
        label: 'Unidad Asignada',
        filter: true,
        options: [],
        validators: [Validators.required],
      }),
      new DropdownQuestion({
        nane: 'direccion',
        label: 'Dirección General',
        filter: true,
        options: [],
        validators: [Validators.required],
      }),
      new DropdownQuestion({
        nane: 'rol',
        label: 'Rol',
        filter: true,
        options: [],
        validators: [Validators.required],
      }),
      new DropdownQuestion({
        nane: 'status',
        label: 'Estatus',
        filter: true,
        options: [
          {
            id: 'A',
            value: 'Activo',
          },
          {
            id: 'I',
            value: 'Inactivo',
          },
        ],
        validators: [Validators.required],
      }),
    ];
    this.form = this._formBuilder.toFormGroup(this.questions);
  }

  getData() {
    this.getDataUnidad();
    this.getDataDirecciones();
    this.getDataRoles();

  }

  getUsuarios() {
    this.usuariosService.getAllUsuarios().subscribe({
      next: (value) => {
        this.data = value.map((usuario) => ({
          name: `${usuario.nombre} ${usuario.primerApellido} ${usuario.segundoApellido}`,
          unidadString: this.listUnidades.filter( (itemUnidad) => itemUnidad.idCatalogo == usuario.unidad)[0]?.cdOpcion ?? 'Unidad no encontrada',
          rolU: this.dataRoles.find((item) => item.idTipoUsuario == usuario.rol).cdtipoUsuario ,
          status: usuario.estatus == 'A' ? 'Activo' : 'Inactivo',
          ...usuario
        }));
      },
    });
  }

  getDataRoles() {
    this.rolesService.getAllRoles().subscribe({
      next: (value) => {
        this.dataRoles = value;
        this.questions[6].options = value
          .map((tipoUsuario) => ({
            id: tipoUsuario.idTipoUsuario,
            value: tipoUsuario.cdtipoUsuario,
          }))
          .sort((a, b) => a.value.localeCompare(b.value));
      },
    });
  }

  getDataDirecciones() {
    this.direccionesService.listarDirecciones().subscribe({
      next: (value) => {
        this.questions[5].options = value.respuesta.map((item) => ({
          id: item.idCatalogo,
          value: item.cdOpcion,
        }));
      },
    });
  }

  getDataUnidad() {
    this.unidadService.consultarActivos()
      .subscribe({
        next: (value) => {
          this.questions[4].options = value.catalogo.map((item) => ({
            id: item.idCatalogo,
            value: item.cdOpcion,
          }))
          this.listUnidades = value.catalogo;
          this.getUsuarios();
        }
      })
  }

  submit() {
    const { nombre, primerApellido, segundoApellido, email, unidad, direccion, rol, status  } = this.form.getRawValue();
    if(
      (!nombre || !nombre.trim())
      || (!primerApellido || !primerApellido.trim())
      || (!email || !email.trim())
      || (!unidad)
      || (!direccion)
      || (!rol)
    ){
      this._alertService.showAlert('Ingrese los datos requeridos para continuar', 'Datos incorrectos');
    } else {
      this.usuariosService.createUsuario({
        cveUsuario: (`${nombre.replace(/\s+/g, '')}.${primerApellido.replace(/\s+/g, '')}`).trim().toLowerCase(),
        contrasenhia: (`${nombre.replace(/\s+/g, '')}.${primerApellido.replace(/\s+/g, '')}`).trim().toLowerCase(),
        nombreUsuario: `${nombre} ${primerApellido} ${segundoApellido}`,
        nombre: nombre,
        primerApellido: primerApellido,
        segundoApellido: segundoApellido,
        correo: email,
        unidad: unidad,
        direccion: direccion,
        area: 2060,
        rol: rol,
        estatus: status ?? 'I',
      }).subscribe({
        next: (value) => {
          this.getUsuarios();
          this.newUser();
          this._alertService.showAlert('Se Guardó Correctamente');
        }
      })
    }
  }

  update() {
    const { nombre, primerApellido, segundoApellido, email, unidad, direccion, rol, status  } = this.form.getRawValue();
    if(
      (!nombre || !nombre.trim())
      || (!primerApellido || !primerApellido.trim())
      || (!email || !email.trim())
      || (!unidad)
      || (!direccion)
      || (!rol)
    ){
      this._alertService.showAlert('Ingrese los datos requeridos para continuar', 'Datos incorrectos');
    } else {
      this.usuariosService.updateUsuario(this.dataSelected.cveUsuario, {
        contrasenhia: this.dataSelected.contrasenhia,
        nombreUsuario: `${nombre} ${primerApellido} ${segundoApellido}`,
        nombre: nombre,
        primerApellido: primerApellido,
        segundoApellido: segundoApellido,
        correo: email,
        unidad: unidad,
        direccion: direccion,
        area: this.dataSelected.area,
        rol: rol,
        estatus: status ?? 'I',
      }).subscribe({
        next: (value) => {
          this.getUsuarios();
          this.newUser();
          this._alertService.showAlert('Se Actualizó Correctamente');
        }
      })
    }
  }

  uploadDataToForm(dataAction: IUsuarioPayload){
    this.form.controls['nombre'].setValue(dataAction.nombre);
    this.form.controls['primerApellido'].setValue(dataAction.primerApellido);
    this.form.controls['segundoApellido'].setValue(dataAction.segundoApellido);
    this.form.controls['email'].setValue(dataAction.correo);
    this.form.controls['unidad'].setValue(dataAction.unidad);
    this.form.controls['direccion'].setValue(dataAction.direccion);
    this.form.controls['rol'].setValue(dataAction.rol);
    this.form.controls['status'].setValue(dataAction.estatus);
  }

  override async onTableAction(event: TableButtonAction) {
    const dataAction: IUsuarioPayload = event.value;
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.resetAllForm();
        this.uploadDataToForm(dataAction);
        this.form.disable();
        this.updateForm = false;
        this.isView = true;
        break;
      case TableConsts.actionButton.edit:
        this.form.enable();
        this.resetAllForm();
        this.uploadDataToForm(dataAction);
        this.dataSelected = dataAction;
        this.updateForm = true;
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this.alertService.showConfirmation(
            { message: '¿Está Seguro de Eliminar el usuario?' });
          if (confirm) {
            this.usuariosService
              .deleteUsuario(dataAction.cveUsuario)
              .subscribe({
                next: (value) => {
                  if (value.mensaje.codigo === '200') {
                    this.data = [
                      ...this.data.filter(
                        (item) => item.cveUsuario !== dataAction.cveUsuario
                      ),
                    ];
                    this.newUser();
                    this._alertService.showAlert('Se Eliminó Correctamente');
                  }
                },
                error: (err) => { },
              });
          }
        }
        break;
    }
  }

  async handleReport() {
    const result = await this.alertService.showConfirmation({
      title: 'Tipo de reporte',
      message: '¿Qué tipo de reporte desea descargar?',
      btnCancelText: 'Cancelación',
      btnConfirmText: 'Alta',
    });
    if (result !== undefined) {
      if (result) {
        // Tipo de reporte: Alta
        this.reportType = 'alta';
      } else {
        // Tipo de reporte: Cancelación
        this.reportType = 'cancelacion';
      }
      setTimeout(() => {
        this.excelJsService.createExcelReporteAcceso({
          reportType: this.reportType,
          data: this.dataReport,
        });
      }, 100);
    }
  }

  onMultiSelect(data: any[]) {
    this.dataReport = data.map((item: any, idx: number) => ({
      no: `${idx + 1}`,
      numeroEmpleado: '',
      nombreCompleto: item.name,
      rolAsignado: item.rolU,
      motivoAcceso: '',
      fechaHoraAsignacion: '',
      fechaHoraAcceso: '',
    }));
  }

  resetAllForm() {
    this.updateForm = false;
    this.isView = false;
    this.form.reset();
  }

  newUser(){
    this.form.enable();
    this.resetAllForm();
  }
}
