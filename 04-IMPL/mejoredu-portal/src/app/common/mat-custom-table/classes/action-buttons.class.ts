import { EventEmitter } from '@angular/core';
import { TableConsts } from '../consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';

export class ActionButtons {
  value!: any;
  action: EventEmitter<TableButtonAction> =
    new EventEmitter<TableButtonAction>();

  onEditClick() {
    this.action.emit({
      name: TableConsts.actionButton.edit,
      value: this.value,
    });
  }
  onDeleteClick() {
    this.action.emit({
      name: TableConsts.actionButton.delete,
      value: this.value,
    });
  }
  onViewClick() {
    this.action.emit({
      name: TableConsts.actionButton.view,
      value: this.value,
    });
  }
  onCustomClick(custom?: any) {
    this.action.emit({
      name: custom.id ?? custom.name ?? TableConsts.actionButton.custom,
      value: this.value,
    });
  }
}
