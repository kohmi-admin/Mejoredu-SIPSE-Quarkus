import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableActionsI } from '@common/mat-custom-table/consts/table';
import { ActionButtons } from '@common/mat-custom-table/classes/action-buttons.class';
import { TableButtonAction } from '@common/models/tableButtonAction';

@Component({
  selector: 'app-table-item',
  templateUrl: './table-item.component.html',
  styleUrls: ['./table-item.component.scss'],
})
export class TableItemComponent extends ActionButtons {
  @Input() key: string = 'name';

  @Input() override value: any = {};
  @Input() actions?: TableActionsI = {
    edit: true,
    delete: true,
    view: true,
    custom: [],
  };
  @Input() actionString!: string;
  @Input() customBtn!: string;
  @Input() complementText?: string;
  @Output() override action: EventEmitter<TableButtonAction> =
    new EventEmitter<TableButtonAction>();

  constructor() {
    super();
  }
}
