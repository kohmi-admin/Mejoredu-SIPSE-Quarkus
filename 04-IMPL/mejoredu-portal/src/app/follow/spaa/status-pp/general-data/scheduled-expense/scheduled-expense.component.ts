import { Component, Input } from '@angular/core';
import { SpentTable } from '../../../adecuaciones/requests/request/budgets/classes/spent-table.class';
import { Spent } from '../../../adecuaciones/requests/request/budgets/classes/spent.class';

@Component({
  selector: 'app-scheduled-expense',
  templateUrl: './scheduled-expense.component.html',
  styleUrls: ['./scheduled-expense.component.scss']
})
export class ScheduledExpenseComponent extends SpentTable {
  @Input() data?: any;
  constructor() {
    super();

    /* this.table.push(

      new Spent(
        'Producto 001',
        'Realizar una Reunión Nacional de autoridades educativas estatales, bajo una organización regional',
        '38301 Congresos y convención',
        10000, 0, 0, 0, 10000, 0, 0, 0, 0, 0, 0, 0, 0
      ),
  
    ); */
  }
  ngOnInit() {
    this.data.map(cxPartidaGasto => {
      cxPartidaGasto.cxPartidaGasto.map(partida => {
        if(partida.calendarizacion){
          partida.calendarizacion.sort(function (a,b) {
            return a.mes - b.mes;
          })
          let spent = new Spent(
            '',
            cxPartidaGasto.cxNombrePresupuesto,
            partida.cxNombrePartida,
            partida.anual,
            partida.calendarizacion[0].monto,
            partida.calendarizacion[1].monto,
            partida.calendarizacion[2].monto,
            partida.calendarizacion[3].monto,
            partida.calendarizacion[4].monto,
            partida.calendarizacion[5].monto,
            partida.calendarizacion[6].monto,
            partida.calendarizacion[7].monto,
            partida.calendarizacion[8].monto,
            partida.calendarizacion[9].monto,
            partida.calendarizacion[10].monto,
            partida.calendarizacion[11].monto,
          );
          this.table.push(spent);
        }
      });
    })
  }
}
