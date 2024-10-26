import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { CardComponent } from './components/card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { AddModalComponent } from './components/card/add-modal/add-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonAppModule } from '@common/common.module';
import { MatInputModule } from '@angular/material/input';
import { AngularSplitModule } from 'angular-split';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    BoardComponent,
    CardComponent,
    AddModalComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    CommonAppModule,
    MatIconModule,
    MatRippleModule,
    MatDialogModule,
    AngularSplitModule,
    MatMenuModule,
  ],
  exports: [
    BoardComponent,
  ]
})
export class BoardModule { }
