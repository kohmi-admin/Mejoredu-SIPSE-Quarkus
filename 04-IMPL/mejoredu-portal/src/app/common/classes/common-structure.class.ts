import { FormGroup } from '@angular/forms';
import { QuestionBase } from '@common/form/classes/question-base.class';
import {
  TableActionsI,
  TableConsts,
} from '@common/mat-custom-table/consts/table';
import { TableButtonAction } from '@common/models/tableButtonAction';
import { TableColumn } from '@common/models/tableColumn';
import { AlertService } from '@common/services/alert.service';

export class CommonStructure {
  form!: FormGroup;
  questions: QuestionBase<string>[] = [];
  data: any[] = [];
  columns: TableColumn[] = [
    { columnDef: 'name', header: 'Descripción', alignLeft: true },
  ];
  actions: TableActionsI | undefined = {
    view: true,
    edit: true,
    delete: true,
  };

  constructor(public _alertService: AlertService) { }

  async onTableAction(event: TableButtonAction) {
    switch (event.name) {
      case TableConsts.actionButton.view:
        this.form.patchValue(event.value);
        this.disableForm();
        break;
      case TableConsts.actionButton.edit:
        this.form.patchValue(event.value);
        this.enableForm();
        break;
      case TableConsts.actionButton.delete:
        {
          const confirm = await this._alertService.showConfirmation(
            { message: '¿Está Seguro de Eliminar el Registro?' });
          if (confirm) {
            this.data = [
              ...this.data.filter((item) => item.id !== event.value.id),
            ];
          }
        }
        break;
    }
  }

  clearForm() {
    this.form.reset();
    this.enableForm();
  }

  disableForm() {
    this.form.disable();
  }

  enableForm() {
    this.form.enable();
    this.form.get('id')?.disable();
  }

  addData() {
    if (!this.form.valid) {
      return;
    }
    const newData = [...this.data];
    newData.push(this.form.value);
    this.data = newData;
    this.clearForm();
  }
}
