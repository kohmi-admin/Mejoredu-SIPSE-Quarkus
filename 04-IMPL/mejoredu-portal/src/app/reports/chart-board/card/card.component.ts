import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChartCardI } from '../interfaces/chart-card.interface';
import { AlertService } from '@common/services/alert.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() item!: ChartCardI;
  @Output() deleteItem: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private _alertService: AlertService,
  ) {
  }

  async delete() {
    const result = await this._alertService.showConfirmation({ message: '¿Está seguro de eliminar la gráfica?' });
    if (result) {
      this.deleteItem.emit(this.item.chart.id);
    }
  }

}
