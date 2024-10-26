import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionButtons } from '@common/mat-custom-table/classes/action-buttons.class';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';

@Component({
  selector: '[action-buttons]',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.css'],
})
export class ActionButtonsComponent extends ActionButtons {
  constructor() {
    super();
  }

  @Input() override value!: any;
  @Input() actions?: TableActionsI = {
    edit: true,
    delete: true,
    view: true,
    custom: [],
  };
  @Input() customBtn!: string;
  @Input() showActionIf!: (action: string, value: any) => boolean;
  @Input() actionString!: string;
  @Input() complementText?: string;
  @Input() separatedActions: boolean = false;
  @Output() override action: EventEmitter<TableButtonAction> =
    new EventEmitter<TableButtonAction>();
  tableConsts = TableConsts;

  showAction(action: string): boolean {
    if (this.actions?.[action]) {
      if (this.showActionIf !== undefined) {
        return this.showActionIf(action, this.value);
      }
      return true;
    }
    return false;
  }

  showActionCustom(id: string): boolean {
    if (this.showActionIf !== undefined) {
      return this.showActionIf(id, this.value);
    }
    return true;
  }
}
