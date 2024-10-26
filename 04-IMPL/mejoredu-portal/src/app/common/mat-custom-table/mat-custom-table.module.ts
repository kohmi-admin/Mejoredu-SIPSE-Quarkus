import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCustomTableComponent } from './mat-custom-table.component';
import { TableActionDirective } from './directives/table-action.directive';
import { ActionButtonsComponent } from './components/action-buttons/action-buttons.component';
import { MatButtonModule } from '@angular/material/button';
import { CdkTableModule } from '@angular/cdk/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntlSpanish } from './utils/mat-paginator-esp';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions, MatTooltipModule } from '@angular/material/tooltip';

export const OtherOptions: MatTooltipDefaultOptions = {
  showDelay: 0,
  hideDelay: 0,
  touchGestures: 'auto',
  position: 'above',
  touchendHideDelay: 0,
  disableTooltipInteractivity: true,
}

@NgModule({
  declarations: [MatCustomTableComponent, TableActionDirective, ActionButtonsComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CdkTableModule,
    MatMenuModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatInputModule,
    FormsModule,
    MatSortModule,
    MatTooltipModule,
  ],
  providers: [
    {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: OtherOptions},
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlSpanish },
    CurrencyPipe,
  ],
  exports: [MatCustomTableComponent]
})
export class MatCustomTableModule { }
