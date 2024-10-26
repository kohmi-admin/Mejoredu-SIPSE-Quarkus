import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddExpenseItemComponent } from './add-expense-item.component';
import { CommonAppModule } from '@common/common.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';



@NgModule({
  declarations: [
    AddExpenseItemComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    CurrencyMaskModule
  ],
  exports: [
    AddExpenseItemComponent
  ]
})
export class AddExpenseItemModule { }
