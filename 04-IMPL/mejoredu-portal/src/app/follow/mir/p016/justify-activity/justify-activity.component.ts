import { Component, Inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { TableActionsI } from '@common/mat-custom-table/consts/table';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';
import { P016Service } from '@common/services/seguimientoMirFid/p016.service';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-justify-activity',
  templateUrl: './justify-activity.component.html',
  styleUrls: ['./justify-activity.component.scss'],
})
export class JustifyActivityComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  dataUser: IDatosUsuario;
  isSubmiting: boolean = false;
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  data: any[] = [];
  productoSeleccionado: any;
  notifier = new Subject();
  columns: TableColumn[] = [
    { columnDef: 'product', header: 'Clave y nombre del Producto', alignLeft: true, width: "400px" },
    { columnDef: 'january', header: 'Enero', alignLeft: true, width: "120px" },
    { columnDef: 'february', header: 'Febrero', alignLeft: true, width: "120px" },
    { columnDef: 'march', header: 'Marzo', alignLeft: true, width: "120px" },
    { columnDef: 'april', header: 'Abril', alignLeft: true, width: "120px" },
    { columnDef: 'may', header: 'Mayo', alignLeft: true, width: "120px" },
    { columnDef: 'june', header: 'Junio', alignLeft: true, width: "120px" },
    { columnDef: 'july', header: 'Julio', alignLeft: true , width: "120px"},
    { columnDef: 'august', header: 'Agosto', alignLeft: true, width: "120px" },
    { columnDef: 'september', header: 'Septiembre', alignLeft: true, width: "120px" },
    { columnDef: 'october', header: 'Octubre', alignLeft: true, width: "120px" },
    { columnDef: 'november', header: 'Noviembre', alignLeft: true, width: "120px" },
    { columnDef: 'december', header: 'Diciembre', alignLeft: true, width: "120px" },
  ];
  actions: TableActionsI = {
    custom: [
      {
        id: 'view',
        icon: 'visibility',
        name: 'Ver Actividades',
      },
    ],
  };
  budgetCalendar: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<JustifyActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModal: any,
    private _formBuilder: QuestionControlService,
    private alertService: AlertService,
    private p016Service: P016Service
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.createQuestions();
  }

  ngOnInit() {
    this.getAll();
  }

  mapJustificaciones(justificaciones: any[]) {
    return justificaciones.map(item => {
      const cal = item.calendario;
      return {
        ...item,
        product: item.nombreProducto,
        january: cal[0].monto,
        february: cal[1].monto,
        march: cal[2].monto,
        april: cal[3].monto,
        may: cal[4].monto,
        june: cal[5].monto,
        july: cal[6].monto,
        august: cal[7].monto,
        september: cal[8].monto,
        october: cal[9].monto,
        november: cal[10].monto,
        december: cal[11].monto,
      }
    })
  }

  createQuestions() {
    const questions: any = [];
    questions.push(
      new TextareaQuestion({
        nane: 'justificación',
        label: 'Justificación (Adecuación)',
        readonly: true,
        value: ''
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'causa',
        label: 'Causa',
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'efectos',
        label: 'Efectos',
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'otrosMotivos',
        label: 'Otros Motivos',
        validators: [Validators.required],
      })
    );

    this.questions = questions;
    this.form = this._formBuilder.toFormGroup(this.questions);

    if (this.dataUser.idTipoUsuario === 'CONSULTOR') {
      this.form.disable();
    }
  }

  getAll() {
    this.p016Service.getJustificacionActividad(this.dataModal.id, this.dataModal.quarter)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          this.budgetCalendar = this.mapJustificaciones(value.respuesta.justificaciones);
        }
      });
  }

  onTableAction(product) {
    if (this.productoSeleccionado) {
      this.budgetCalendar.find(item => {
        if (item.idProducto == this.productoSeleccionado.idProducto) {
          item.justificación = this.form.getRawValue().justificacion
          item.causa = this.form.getRawValue().causa;
          item.efectos = this.form.getRawValue().efectos;
          item.otrosMotivos = this.form.getRawValue().otrosMotivos;
        }
      })
    }
      this.form.get('justificación')?.setValue(product.justificacion);
      this.form.get('causa')?.setValue(product.causa);
      this.form.get('efectos')?.setValue(product.efectos);
      this.form.get('otrosMotivos')?.setValue(product.otrosMotivos);

    this.productoSeleccionado = product;
  }

  submit(): void {
    if (this.form.valid) {
      this.isSubmiting = true;
      let form = this.mapRequest(this.form.getRawValue());
      this.p016Service.justificacionActividad(form).subscribe({
        next: (value) => {
          this.alertService.showAlert('Se Guardó Correctamente');
          this.dialogRef.close('success');
        }
      });
    }
  }

  mapRequest(form) {
    return {
      "idIndicador": this.dataModal.id,
      "trimestre": this.dataModal.quarter,
      "justificaciones": this.budgetCalendar,
      "cveUsuario": this.dataUser.cveUsuario
    }
  }
}
