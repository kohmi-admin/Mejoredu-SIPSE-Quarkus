import { Component, Input } from '@angular/core';
import { ExpensiveResumeI } from '../../add-expense-item/interfaces/expensive-resume.interface';
import { ExpenseItemI } from '../../add-expense-item/interfaces/expensive-item.interface';
import { lastValueFrom } from 'rxjs';
import { AddExpenseItemComponent } from '../../add-expense-item/add-expense-item.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '@common/services/alert.service';

@Component({
  selector: 'app-modify-budgets',
  templateUrl: './modify-budgets.component.html',
  styleUrls: ['./modify-budgets.component.scss']
})
export class ModifyBudgetsComponent {
  @Input() receivedRecord: any;
  receivedRecordExist: boolean = false;
  isView: boolean = false;

  handleSetRecord(event: any) {
    this.receivedRecord = event;
    if(event != null ) {
      this.receivedRecordExist = true;
      if(event.actionEmmit == 2){
        this.isView = true;
      } else {
        this.isView = false;
      }
    } else {
      this.receivedRecordExist = false;
    }
  }

  handleExpensiveResumesChange(newExpensiveResumes: ExpensiveResumeI[]) {
    this.expensiveResumes = newExpensiveResumes;
  }

  expensiveResumes: ExpensiveResumeI[] = [];

  constructor(
    private _dialog: MatDialog,
    private _alertService: AlertService,
  ) {}

  async addExpenseItem(): Promise<void> {
    const result: ExpenseItemI[] = await lastValueFrom(
      this._dialog
        .open(AddExpenseItemComponent, {
          width: '1600px',
        })
        .afterClosed()
    );
    if (!result) {
      return;
    }

    const newExpensiveResumes = [...this.expensiveResumes]; // Crear una nueva referencia al array

    result.forEach((item: ExpenseItemI) => {
      if (item.ampleacion) {
        newExpensiveResumes.push({
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
        newExpensiveResumes.push({
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

    this.expensiveResumes = newExpensiveResumes;
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

  async deleteAmpliaReduccion(dataDelete: any) {
    const confirm = await this._alertService.showConfirmation({
      message: `¿Está Seguro de Eliminar la Partida de Gasto ${dataDelete.partida}?`,
    });
    if (confirm) {
      if(dataDelete.claveAmpleacion){
        this.expensiveResumes = this.expensiveResumes.filter(
          (item) =>
            (item?.claveAmpleacion !== dataDelete?.claveAmpleacion)
        );
      } else {
        this.expensiveResumes = this.expensiveResumes.filter(
          (item) =>
            (item?.claveReduccion !== dataDelete?.claveReduccion)
        );
      }

    }
  }
}
