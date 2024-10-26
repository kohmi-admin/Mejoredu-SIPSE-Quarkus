import { lastValueFrom } from "rxjs";
import { ExpenseItemI } from "../interfaces/expensive-item.interface";
import { ExpensiveResumeI } from "../interfaces/expensive-resume.interface";
import { MatDialog } from "@angular/material/dialog";
import { FormGroup } from "@angular/forms";
import { QuestionBase } from "@common/form/classes/question-base.class";

interface DialogComponent {
  new (...args: any[]): any;
}

export class ReductionEnlargement {
    form!: FormGroup;
    questions: QuestionBase<any>[] = [];
    expensiveResumes: ExpensiveResumeI[] = [];

    constructor(
      private _dialog: MatDialog,
      private dialogComponent: DialogComponent
    ) {}

    async addExpenseItem(): Promise<void> {
      const result: ExpenseItemI[] = await lastValueFrom(
        this._dialog
          .open(this.dialogComponent, {
            width: '1600px',
          })
          .afterClosed()
      );
      if (!result) {
        return;
      }
      result.forEach((item: ExpenseItemI) => {
        if (item.ampleacion) {
          this.expensiveResumes.push({
            partida: item.nombrePartidaGasto,
            claveAmpleacion: item.clavePresupuestal,
            importeAmpleacion: item.importe,
            mesAmpleacion: item.mes,
            claveReduccion: '',
            importeReduccion: undefined,
            mesReduccion: '',
            importeNeto: item.importe,
            partidaId: item.idPartidaGasto,
            mesIdReduccion: 0,
            mesIdAmpleacion: item.mesId
          });
        } else {
          this.expensiveResumes.push({
            partida: item.nombrePartidaGasto,
            claveAmpleacion: '',
            importeAmpleacion: undefined,
            mesAmpleacion: '',
            claveReduccion: item.clavePresupuestal,
            importeReduccion: ((item.importe || 0) * -1),
            mesReduccion: item.mes,
            importeNeto: ((item.importe || 0) * -1),
            partidaId: item.idPartidaGasto,
            mesIdReduccion: item.mesId,
            mesIdAmpleacion: 0
          });
        }
      });
    }

    getSumImporteAmpleacion(): number {
      return this.expensiveResumes.reduce((a, b) => a + (b.importeAmpleacion || 0), 0);
    }

    getSumImporteReduccion(): number {
      return this.expensiveResumes.reduce((a, b) => a + (b.importeReduccion || 0), 0);
    }
    getSumImporteNeto(): number {
      return this.getSumImporteAmpleacion() + this.getSumImporteReduccion();
    }
}
