import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { DropdownQuestion } from '@common/form/classes/question-dropdown.class';
import { TextareaQuestion } from '@common/form/classes/question-textarea.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';
import { QuestionControlService } from '@common/form/services/question-control.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';
import { M001Service } from '@common/services/seguimientoMirFid/m001.service';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-m001',
  templateUrl: './m001.component.html',
  styleUrls: ['./m001.component.scss'],
})
export class M001Component implements OnInit {
  ls = new SecureLS({ encodingType: 'aes' });
  @Input() ppName = 'M001';
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  form2!: FormGroup;
  questions2: QuestionBase<string>[] = [];
  data: any[] = [];
  columns: TableColumn[] = [
    {
      columnDef: 'program',
      header: 'Programa Presupuestario',
      alignLeft: true,
    },
    { columnDef: 'unidad', header: 'Unidad' },
    { columnDef: 'ramo', header: 'Ramo' },
    { columnDef: 'indicadorNombre', header: 'Nombre del Indicador' },
    { columnDef: 'porcentaje', header: 'Porcentaje del Indicador' },
    { columnDef: 'justificación', header: 'Justificación' },
  ];
  actions: TableActionsI = {
    view: true,
    /* edit: true, */
    custom: [
      /* {
        id: 'download',
        icon: 'download',
        name: 'Descargar',
      }, */
    ],
  };

  dataUser: IDatosUsuario;
  yearNav = this.ls.get('yearNav');
  m001: any;
  cveUsuario: string;
  currentSemester: number = 1;

  constructor(
    private _formBuilder: QuestionControlService,
    private m001Service: M001Service,
    private _alertService: AlertService
  ) {
    this.dataUser = this.ls.get('dUaStEaR');
    this.cveUsuario = this.dataUser.cveUsuario;
    this.currentSemester = this.getCurrentSemester();
  }

  ngOnInit(): void {
    const questions: any = [];

    questions.push(
      new TextboxQuestion({
        nane: 'nombreUnidad',
        label: 'Clave y Nombre de la Unidad',
        validators: [Validators.required],
        value: '',
        disabled: true,
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'ramo',
        label: 'Ramo',
        value: '',
        validators: [Validators.required],
        disabled: true,
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'programaPresupuestario',
        label: 'Programa Presupuestario',
        //value: this.ppName + ' Actividades de apoyo administrativo',
        value: '',
        validators: [Validators.required],
        disabled: true,
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'nombreIndicador',
        label: 'Nombre del Indicador',
        value: '',
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'definicion',
        label: 'Definición',
        value: '',
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'tipoValorMeta',
        label: 'Tipo de Valor de la Meta',
        options: [
          {
            id: 1,
            value: 'Relativo',
          },
          {
            id: 2,
            value: 'Absoluto',
          },
        ],
        validators: [Validators.required],
        value: '',
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'idIndicadorPEF',
        label: 'Indicador PEF',
        options: [
          {
            id: 1,
            value: 'Sí',
          },
          {
            id: 2,
            value: 'No',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'idTipoFormula',
        label: 'Tipo de Fórmula',
        options: [
          {
            id: 1,
            value: '(A/B) * 100',
          },
          {
            id: 2,
            value: 'Otro',
          },
        ],
        validators: [Validators.required],
      })
    );

    questions.push(
      new DropdownQuestion({
        nane: 'idEstatusAvance',
        label: 'Estatus – Registro del Avance',
        options: [
          {
            id: 1,
            value: 'En Proceso',
          },
          {
            id: 2,
            value: 'Flujo Concluído',
          },
        ],
        validators: [Validators.required],
      })
    );
    // - - - -
    questions.push(
      new TextboxQuestion({
        nane: 'periodo',
        label: 'Período',
        validators: [Validators.required],
        disabled: true,
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'metaEsperada',
        label: 'Meta Esperada %',
        type: 'number',
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'numerador',
        label: 'Numerador',
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'denominador',
        label: 'Denominador',
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'indicador',
        label: 'Indicador',
        type: 'number',
        validators: [Validators.required],
      })
    );
    // - - - -
    questions.push(
      new TextboxQuestion({
        nane: 'periodo2',
        label: 'Período',
        disabled: true,
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'metaEsperada2',
        label: 'Meta Esperada %',
        type: 'number',
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'numerador2',
        label: 'Numerador',
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'denominador2',
        label: 'Denominador',
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'indicador2',
        label: 'Indicador',
        type: 'number',
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextboxQuestion({
        nane: 'tipoAjuste',
        label: 'Tipo de Ajuste',
        validators: [Validators.required],
      })
    );

    questions.push(
      new TextareaQuestion({
        nane: 'causas',
        label: 'Causas',
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

    const questions2: any = [];
    questions2.push(
      new TextboxQuestion({
        nane: 'periodo',
        label: 'Período',
        disabled: true,
        validators: [Validators.required],
      })
    );

    questions2.push(
      new TextboxQuestion({
        nane: 'metaEsperadaOtrasMetas',
        label: 'Meta Esperada %',
        type: 'number',
        validators: [Validators.required],
      })
    );

    questions2.push(
      new TextboxQuestion({
        nane: 'numeradorOtrasMetas',
        label: 'Numerador',
        validators: [Validators.required],
      })
    );

    questions2.push(
      new TextboxQuestion({
        nane: 'indicadorOtrasMetas',
        label: 'Indicador',
        type: 'number',
        validators: [Validators.required],
      })
    );
    // - - - - - -
    questions2.push(
      new TextboxQuestion({
        nane: 'periodo2',
        label: 'Período',
        disabled: true,
        validators: [Validators.required],
      })
    );

    questions2.push(
      new TextboxQuestion({
        nane: 'metaEsperadaOtrasMetasCicloAjustado',
        label: 'Meta Esperada %',
        type: 'number',
        validators: [Validators.required],
      })
    );

    questions2.push(
      new TextboxQuestion({
        nane: 'numeradorOtrasMetasCicloAjustado',
        label: 'Numerador',
        validators: [Validators.required],
      })
    );

    questions2.push(
      new TextboxQuestion({
        nane: 'indicadorOtrasMetasCicloAjustado',
        label: 'Indicador',
        type: 'number',
        validators: [Validators.required],
      })
    );

    questions2.push(
      new TextboxQuestion({
        nane: 'tipoAjusteOtrasMetasCicloAjustado',
        label: 'Tipo de Ajuste',
        validators: [Validators.required],
      })
    );

    questions2.push(
      new TextareaQuestion({
        nane: 'causasOtrasMetasCicloAjustado',
        label: 'Causas',
        validators: [Validators.required],
      })
    );

    questions2.push(
      new TextareaQuestion({
        nane: 'efectosOtrasMetasCicloAjustado',
        label: 'Efectos',
        validators: [Validators.required],
      })
    );

    questions2.push(
      new TextareaQuestion({
        nane: 'otrosMotivosOtrasMetasCicloAjustado',
        label: 'Otros Motivos',
        validators: [Validators.required],
      })
    );

    this.questions2 = questions2;
    this.form2 = this._formBuilder.toFormGroup(this.questions2);

    this.m001Service
      .consultaMir(this.yearNav, this.cveUsuario, this.currentSemester)
      .subscribe((response) => {
        this.m001 = response.respuesta;
        this.buildForm(response.respuesta);
      });
    this.getAll();
    if (this.dataUser.idTipoUsuario === 'CONSULTOR') {
      this.form.disable();
    }
  }

  buildForm(response: any): void {
    const questions: any = [];
    const programa = response.programa;
    const indicador = response.indicador;
    const ciclo = response.ciclo;
    const cicloAjustado = response.cicloAjustado;
    const otrasMetas = response.otrasMetas;
    const otrasMetasCicloAjustado = response.otrasMetasCicloAjustado;

    const claveNombreUnidad =
      programa.claveUnidad + ' ' + programa.nombreUnidad;
    const ramo = programa.ramo ?? '';
    const programaPresupuestario = programa.nombreProgramaPresupuestario;
    const semestre =
      this.currentSemester == 1 ? 'Primer semestre' : 'Segundo semestre';

    const nombreIndicador = indicador.nombre;
    const definicionIndicador = indicador.definicion;
    const tipoValorMeta = indicador.ixTipoValorMeta;
    const indicadorPEF = indicador.indicadorPEF;
    const tipoFormula = indicador.ixTipoFormula;
    const estatusAvance = indicador.ixEstatusAvance;

    const metaEsperada = ciclo.meta;
    const numerador = ciclo.numerador;
    const denominador = ciclo.denominador;
    const indicadorCiclo = ciclo.indicador;

    const metaEsperadaCicloAjustado = cicloAjustado.meta;
    const numeradorCicloAjustado = cicloAjustado.numerador;
    const denominadorCicloAjustado = cicloAjustado.denominador;
    const indicadorCicloAjustado = cicloAjustado.indicador;
    const tipoAjuste = cicloAjustado.tipoAjuste;
    const causas = cicloAjustado.causas;
    const efectos = cicloAjustado.efectos;
    const otrosMotivos = cicloAjustado.otrosMotivos;

    const indicadorOtrasMetas = otrasMetas.indicador;
    const metaOtrassMetas = otrasMetas.meta;
    const numeradorOtrasMetas = otrasMetas.numerador;

    const metaEsperadaOtrasMetasCicloAjustado = otrasMetasCicloAjustado.meta;
    const numeradorOtrasMetasCicloAjustado = otrasMetasCicloAjustado.numerador;
    const indicadorOtrasMetasCicloAjustado = otrasMetasCicloAjustado.indicador;
    const tipoAjusteOtrasMetasCicloAjustado =
      otrasMetasCicloAjustado.tipoAjuste;
    const causasOtrasMetasCicloAjustado = otrasMetasCicloAjustado.causas;
    const efectosOtrasMetasCicloAjustado = otrasMetasCicloAjustado.efectos;
    const otrosMotivosOtrasMetasCicloAjustado =
      otrasMetasCicloAjustado.otrosMotivos;

    this.form.patchValue({
      nombreUnidad: claveNombreUnidad,
      ramo,
      programaPresupuestario,
      nombreIndicador,
      definicion: definicionIndicador,
      tipoValorMeta,
      idIndicadorPEF: indicadorPEF ? 1 : 2,
      idTipoFormula: tipoFormula,
      idEstatusAvance: estatusAvance,
      periodo: semestre,
      metaEsperada,
      numerador,
      denominador,
      indicador: indicadorCiclo,
      periodo2: semestre,
      metaEsperada2: metaEsperadaCicloAjustado,
      numerador2: numeradorCicloAjustado,
      denominador2: denominadorCicloAjustado,
      indicador2: indicadorCicloAjustado,
      tipoAjuste,
      causas,
      efectos,
      otrosMotivos,
    });

    this.form2.patchValue({
      periodo: semestre,
      metaEsperadaOtrasMetas: metaOtrassMetas,
      numeradorOtrasMetas,
      indicadorOtrasMetas,
      periodo2: semestre,
      metaEsperadaOtrasMetasCicloAjustado,
      numeradorOtrasMetasCicloAjustado,
      indicadorOtrasMetasCicloAjustado,
      tipoAjusteOtrasMetasCicloAjustado,
      causasOtrasMetasCicloAjustado,
      efectosOtrasMetasCicloAjustado,
      otrosMotivosOtrasMetasCicloAjustado,
    });

  }

  async getAll(): Promise<void> {
    this.data = [];
    this.m001Service
      .consultaTodosO001(this.yearNav, this.cveUsuario, this.currentSemester)
      .subscribe((response) => {
        this.data = this.mapResponse(response.respuesta);
      });
  }

  private mapResponse(response) {
    let resp = response.map((item) => {
      return {
        ...item,
        program: item.programa.nombreProgramaPresupuestario,
        unidad: item.programa.claveUnidad + item.programa.nombreUnidad,
        ramo: item.programa.ramo,
        indicadorNombre: item.indicador.nombre,
        porcentaje: item.cicloAjustado.indicador,
        justificación: item.cicloAjustado.causas,
      };
    });
    return resp;
  }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.buildForm(event.value);
        break;
    }
  }

  submit(): void {
    let request = this.mapRequest();
    this.m001Service.postActividadM001(request).subscribe((response: any) => {
      if (response.codigo == 200) {
        this._alertService.showAlert('Se guardó correctamente.');
      }
    });
  }

  submit2(): void {
    let requeest2 = this.mapRequest2();
    this.m001Service.postMetadM001(requeest2).subscribe((response: any) => {
      if (response.codigo == 200) {
        this._alertService.showAlert('Se guardó correctamente.');
      }
    });
  }

  private getCurrentSemester(): number {
    const month = new Date().getMonth();
    if (month < 6) {
      return 1;
    } else return 2;
  }

  private mapRequest() {
    let form = this.form.value;
    return {
      idAnhio: parseInt(this.yearNav),
      periodo: this.currentSemester,
      cveUsuario: this.dataUser.cveUsuario,
      indicador: {
        nombre: form.nombreIndicador,
        definicion: form.definicion,
        ixTipoValorMeta: parseInt(form.tipoValorMeta),
        indicadorPEF: form.idIndicadorPEF == 1 ? true : false,
        ixTipoFormula: parseInt(form.idTipoFormula),
        tipoFormula: form.idTipoFormula == 1 ? '(A/B) * 100' : 'Otro',
        ixEstatusAvance: parseInt(form.idEstatusAvance),
      },
      ciclo: {
        meta: parseFloat(form.metaEsperada),
        numerador: parseFloat(form.numerador),
        indicador: parseFloat(form.indicador),
        denominador: parseFloat(form.denominador),
      },
      cicloAjustado: {
        meta: parseFloat(form.metaEsperada2),
        numerador: parseFloat(form.numerador2),
        indicador: parseFloat(form.indicador2),
        tipoAjuste: form.tipoAjuste,
        causas: form.causas,
        efectos: form.efectos,
        otrosMotivos: form.otrosMotivos,
        denominador: parseFloat(form.denominador2),
      },
    };
  }

  private mapRequest2() {
    let form = this.form2.value;
    return {
      idAnhio: parseInt(this.yearNav),
      periodo: this.currentSemester,
      cveUsuario: this.cveUsuario,
      otrasMetas: {
        meta: parseFloat(form.metaEsperadaOtrasMetas),
        numerador: form.numeradorOtrasMetas,
        indicador: form.indicadorOtrasMetas,
      },
      cicloAjustado: {
        meta: form.metaEsperadaOtrasMetasCicloAjustado,
        numerador: form.numeradorOtrasMetasCicloAjustado,
        indicador: form.indicadorOtrasMetasCicloAjustado,
        tipoAjuste: form.tipoAjusteOtrasMetasCicloAjustado,
        causas: form.causasOtrasMetasCicloAjustado,
        efectos: form.efectosOtrasMetasCicloAjustado,
        otrosMotivos: form.otrosMotivosOtrasMetasCicloAjustado,
      },
    };
  }
}
