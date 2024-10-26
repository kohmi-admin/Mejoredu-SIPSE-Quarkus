import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionBase } from '@common/form/classes/question-base.class';
import { ReportActions } from 'src/app/reports/numeralia/class/report-actions.class';
import { ReportBuilderI } from './interfaces/rb-interface';

@Component({
  selector: 'app-report-builder',
  templateUrl: './report-builder.component.html',
  styleUrls: ['./report-builder.component.scss'],
})
export class ReportBuilderComponent extends ReportActions {
  constructor(
    public dialogRef: MatDialogRef<ReportBuilderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReportBuilderI
  ) {
    super();
    this.reportName = data.reportName;
  }

  getValue(item: QuestionBase<any>) {
    let result = item.value;
    if (item.controlType === 'dropdown') {
      if (Array.isArray(item.value)) {
        result = item.value
          .map((v) =>
            item.optionsArray
              .filter((o) => o.id === v)
              .map((o) => o.value)
              .join('')
          )
          .join(', ');
      } else {
        result = item.optionsArray
          .filter((o) => o.id === item.value)
          .map((o) => o.value)
          .join('');
      }
    }
    return result === '' || result === undefined || result === null
      ? '- - -'
      : result;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
