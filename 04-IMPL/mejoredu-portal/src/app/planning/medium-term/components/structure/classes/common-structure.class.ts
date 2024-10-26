import { FormGroup } from "@angular/forms";
import { QuestionBase } from "@common/form/classes/question-base.class";
import { TableActionsI } from "@common/mat-custom-table/consts/table";
import { TableColumn } from "@common/models/tableColumn";

export class CommonStructure {
    editable: boolean = true;
    validation: boolean = false;
    form!: FormGroup;
    questions: QuestionBase<string>[] = [];
    data: any[] = [];
    columns: TableColumn[] = [
      { columnDef: 'name', header: 'Descripción', alignLeft: true },
    ]
    actions: TableActionsI | undefined = {
      view: true,
      edit: true,
      delete: true,
    }
}