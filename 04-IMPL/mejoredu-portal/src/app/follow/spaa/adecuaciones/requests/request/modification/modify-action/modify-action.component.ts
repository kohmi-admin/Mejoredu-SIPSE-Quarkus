import { Component, Input } from '@angular/core';
import { ICatalogResponse } from '@common/interfaces/catalog.interface';

@Component({
  selector: 'app-modify-action',
  templateUrl: './modify-action.component.html',
  styleUrls: ['./modify-action.component.scss']
})
export class ModifyActionComponent {
  @Input() catCategoriaR!: ICatalogResponse;
  @Input() catNivelEducativoR!: ICatalogResponse;
  @Input() catTipoProductoR!: ICatalogResponse;

  @Input() receivedRecord: any;
  @Input() receivedEvents: any;

  handleSetRecord(event: any) {
    this.receivedRecord = event;
  }

  handleSetEvents(event: any) {
    this.receivedEvents = event;
  }
}
