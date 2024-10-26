import { Component } from '@angular/core';
import { MIRDataI } from '../interfaces/mir-data.interface';
import { MatDialog } from '@angular/material/dialog';
import { JustifyComponent } from './justify/justify.component';
import { JustifyActivityComponent } from './justify-activity/justify-activity.component';
import { P016Service } from '@common/services/seguimientoMirFid/p016.service';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import * as SecureLS from 'secure-ls';
import { Subject, takeUntil } from 'rxjs';
import { IItemConsultaMirPorAnhioResponse } from '@common/interfaces/seguimientoMirFid/mirFid.interface';
import { TableColumn } from '@common/models/tableColumn';
import { TableActionsI } from '@common/mat-custom-table/consts/table';
import { ReportBuilderComponent } from '@common/report-builder/report-builder.component';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { TextboxQuestion } from '@common/form/classes/question-textbox.class';

@Component({
  selector: 'app-p016',
  templateUrl: './p016.component.html',
  styleUrls: ['./p016.component.scss'],
})
export class P016Component {
  ls = new SecureLS({ encodingType: 'aes' });
  currentQuarter: number = 3;
  trimsData = [
    'Unidad',
    'Programado',
    'Porcentaje<br>Programado',
    'Reportado',
    'Porcentaje<br>Reportado',
  ];
  data: MIRDataI[] = [];
  data2: any;
  dataUser: IDatosUsuario;
  yearNav: string;
  canEdit: boolean = false;
  notifier = new Subject();
  columns: TableColumn[] = [
    { columnDef: 'nivel', header: 'Nivel de MIR', alignLeft: true, width: '500px' },
    { columnDef: 'unidad', header: 'Unidad', width: '500px' },
    { columnDef: 'indicador', header: 'Estatus', width: '500px' },
  ];
  actions: TableActionsI = {
    edit: true,
    custom: [
      {
        id: 'download',
        icon: 'download',
        name: 'Descargar',
      },
    ],
  };

  downloadDisable: boolean = true;

  constructor(private _dialog: MatDialog, private p016Service: P016Service, public dialog: MatDialog) {
    this.canEdit = this.ls.get('canEdit');
    this.dataUser = this.ls.get('dUaStEaR');
    this.yearNav = this.ls.get('yearNav');
    const initials = this.trimsData;
    for (let i = 1; i < 3; i++) {
      initials.push(...initials);
    }
    // this.getAll();
    this.getMIRFID();
    this.getJustificaciones();
    this.validateDownload();
  }

  validateDownload(){
    let role = this.dataUser.idTipoUsuario;
    let unidad = this.dataUser.perfilLaboral.cveUnidad;
    if(role === 'ADMINISTRADOR' || role === 'CONSULTOR' || (role === 'ENLACE' && unidad === '1210')){
      this.downloadDisable = false;
    }
  }

  onTableAction(data) {
    console.log(data)
    if (data.name == 'edit') {
      this.openJustifyEdit(data.value);
    } else {
      this.openDialog(data.value);
      /* const questions: QuestionBase<any>[] = [
        new TextboxQuestion({
          nane: 'nivel',
          label: 'Nivel',
          value: data.value.nivel,
        }),
        new TextboxQuestion({
          nane: 'unidad',
          label: 'Unidad',
          value: data.value.idCatalogoUnidad,
        }),
        new TextboxQuestion({
          nane: 'indicador',
          label: 'Indicador',
          value: data.value.indicador,
        }),
      ] */

    }
  }
  getJustificaciones() {
    this.p016Service.consultajustificaciones(this.yearNav, this.currentQuarter)
      .pipe(takeUntil(this.notifier))
      .subscribe((value: any) => {
        if (value.codigo === '200') {
          this.data2 = value.respuesta;
        }
      }
      );
  }

  getMIRFID() {
    this.p016Service
      .getMirByAnhio(+this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe((value) => {
        if (value.codigo === '200' && value.respuesta.length) {
          this.data = value.respuesta.map((item, idx) => ({
            id: item.idIndicadorResultado,
            mir: item.nivel,
            indicador: item.indicador,
            unidad_1: item.primero.unidad,
            programado_1: item.primero.programado,
            porcentaje_programado_1: item.primero.porcentajeProgramado,
            reportado_1: item.primero.reportado,
            porcentaje_reportado_1: item.primero.porcentajeReportado,
            unidad_2: item.segundo.unidad,
            programado_2: item.segundo.programado,
            porcentaje_programado_2: item.segundo.porcentajeProgramado,
            reportado_2: item.segundo.reportado,
            porcentaje_reportado_2: item.segundo.porcentajeReportado,
            unidad_3: item.tercero.unidad,
            programado_3: item.tercero.programado,
            porcentaje_programado_3: item.tercero.porcentajeProgramado,
            reportado_3: item.tercero.reportado,
            porcentaje_reportado_3: item.tercero.porcentajeReportado,
            unidad_4: item.cuarto.unidad,
            programado_4: item.cuarto.programado,
            porcentaje_programado_4: item.cuarto.porcentajeProgramado,
            reportado_4: item.cuarto.reportado,
            porcentaje_reportado_4: item.cuarto.porcentajeReportado,
            alcanzadoAcumulado: item.alcanzadoAcumulado,
            porcentajeAcumulado: item.porcentajeAcumulado,
            estatus: item.estatus,
          }));
          this.data = this.ordenarObjetos(this.data)
        }
      }
      );
  }

  isCurrentColumns(column: number): boolean {
    return (
      column + 1 <= this.currentQuarter * 5 - 5 ||
      column + 1 > this.currentQuarter * 5
    );
  }

  getTrimValue(data: any, trimsDataItem: string, trim: number): any {
    const trimNum: number = trim < 6 ? 1 : trim < 11 ? 2 : trim < 16 ? 3 : 4;
    switch (trimsDataItem) {
      case 'Unidad':
        return data[`unidad_${trimNum}`];
      case 'Programado':
        return data[`programado_${trimNum}`];
      case 'Porcentaje<br>Programado':
        return data[`porcentaje_programado_${trimNum}`];
      case 'Reportado':
        return data[`reportado_${trimNum}`];
      case 'Porcentaje<br>Reportado':
        return data[`porcentaje_reportado_${trimNum}`];
      default:
        return '';
    }
  }

  openJustify(data: any): void {
    let dialogRef: any = null;

    data = {
      ...data,
      quarter: this.currentQuarter
    }
    if (
      data.mir.startsWith('F') ||
      data.mir.startsWith('P') ||
      data.mir.startsWith('C')
    ) {
      dialogRef = this._dialog.open(JustifyComponent, {
        data,
        width: '800px',
      });
    } else {
      dialogRef = this._dialog.open(JustifyActivityComponent, {
        data,
        width: '1000px',
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getMIRFID();
      }
    });
  }

  openJustifyEdit(justificacion: any): void {
    let dialogRef: any = null;
    let justify = this.data.filter(indicador => {
      if (justificacion.idIndicadorResultado == indicador.id) {
        return indicador;
      }
    })[0]
    let data = {
      ...justify,
      quarter: this.currentQuarter
    }
    console.log(data);
    if (
      data.mir.startsWith('F') ||
      data.mir.startsWith('P') ||
      data.mir.startsWith('C')
    ) {
      dialogRef = this._dialog.open(JustifyComponent, {
        data,
        width: '800px',
      });

    } else {
      dialogRef = this._dialog.open(JustifyActivityComponent, {
        data,
        width: '800px',
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getMIRFID();
      }
    });
  }

  openDialog(justificacion) {
    let justify = this.data.filter(indicador => {
      if (justificacion.idIndicadorResultado == indicador.id) {
        return indicador;
      }
    })[0];

    if (
      justify.mir.startsWith('F') ||
      justify.mir.startsWith('P') ||
      justify.mir.startsWith('C')
    ) {
      this.p016Service.getJustificacionIndicador(justify.id).subscribe(response => {
        let data = response.respuesta;
        const questions: QuestionBase<any>[] = [];
        for (let [key, value] of Object.entries(data)) {
          if (key != 'archivos' && key != 'idIndicador' && key != 'cveUsuario') {
            if(key == 'otrosMotivos') key = 'otros motivos';
            key = key.split('')[0].toUpperCase() + key.split('').splice(1).join('');
            questions.push(new TextboxQuestion({
              nane: key,
              label: key,
              value: value,
            }));
          }
        }
        this.dialog.open(ReportBuilderComponent, {
          data: {
            questions,
            reportName: 'Reporte general',
          },
          width: '1000px',
        });
      })
    } else {
      this.p016Service.getJustificacionActividad(justify.id, this.currentQuarter).subscribe(response => {
        let data = response.respuesta;
        const questions: QuestionBase<any>[] = [];
        for (const [key, value] of Object.entries(data)) {
          if (key != 'archivos' && key != 'idIndicador' && key != 'cveUsuario') {
            questions.push(new TextboxQuestion({
              nane: key,
              label: key,
              value: value,
            }));
          }
        }
        this.dialog.open(ReportBuilderComponent, {
          data: {
            questions,
            reportName: 'Reporte general',
          },
          width: '1000px',
        });
      })
    }

  }

  ngOnDestroy() {
    this.notifier.complete();
  }

  private ordenarObjetos(objetos) {
    const ordenNiveles = {
      'Fin': 1,
      'Propósito': 2,
      'Componente': 3,
      'Actividad': 4
    };

    return objetos.sort((a, b) => {
      // Primero comparamos por el nivel de Fin y Propósito, que deben ir primero
      if (ordenNiveles[a.nivel] !== ordenNiveles[b.nivel]) {
        return ordenNiveles[a.nivel] - ordenNiveles[b.nivel];
      }

      // Si ambos niveles son Componente o Actividad del componente, comparamos por indicador
      if (a.nivel === 'Componente' || a.nivel === 'Actividad') {
        const resultadoIndicador = this.compararIndicadores(a.indicador, b.indicador);
        if (resultadoIndicador !== 0) {
          return resultadoIndicador;
        }

        // Si el indicador es el mismo, comparamos por el nivel para mantener Componente antes de Actividad del componente
        return ordenNiveles[a.nivel] - ordenNiveles[b.nivel];
      }

      // Para niveles que no sean Componente o Actividad del componente, no es necesario hacer más comparaciones
      return 0;
    });
  }
  private compararIndicadores(ind1, ind2) {
    const esCausa1 = ind1.startsWith('causa');
    const esCausa2 = ind2.startsWith('causa');

    // Si ambos indicadores son "causa", los comparamos numéricamente
    if (esCausa1 && esCausa2) {
      const partes1 = ind1.split('.').map(Number);
      const partes2 = ind2.split('.').map(Number);

      for (let i = 0; i < Math.max(partes1.length, partes2.length); i++) {
        const num1 = partes1[i] || 0;
        const num2 = partes2[i] || 0;

        if (num1 < num2) {
          return -1;
        }
        if (num1 > num2) {
          return 1;
        }
      }

      return 0;
    }

    // Si solo uno de los indicadores es "causa", este debe ir primero
    if (esCausa1 && !esCausa2) {
      return -1;
    }
    if (!esCausa1 && esCausa2) {
      return 1;
    }

    // Si ninguno de los indicadores es "causa", los comparamos como texto
    return ind1.localeCompare(ind2);
  }
}
