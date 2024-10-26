import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardI } from '../../interfaces/card.interface';
import { MatDialog } from '@angular/material/dialog';
import { AddModalComponent } from './add-modal/add-modal.component';
import { CardService } from './services/card.service';
import { Essential } from './classes/essential.class';
import { lastValueFrom } from 'rxjs';
import { AlertService } from '@common/services/alert.service';
import { BoardService } from '../../services/board.service';
import { TypeCardEnum } from '../../enums/type.enum';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent extends Essential {
  @Input() override card!: CardI;
  @Input() number!: boolean;
  @Input() isChild: boolean = false;
  @Input() parentIsComponent?: boolean;
  @Output() delete: EventEmitter<CardI> = new EventEmitter();
  activeRipple: boolean = false;

  constructor(
    private _dialog: MatDialog,
    private cardService: CardService,
    private _alertService: AlertService,
    private _boardService: BoardService
  ) {
    super(cardService);
  }

  get canEdit(): boolean {
    return this._boardService.canEdit;
  }

  get canAdd(): boolean {
    return this._boardService.canAdd;
  }

  async openAddModal(): Promise<void> {
    if (!this.canEdit) {
      return;
    }
    const response = await this.setModal(this.card);
    if (!response) return;
    this.card.description = response.description;
  }

  async setModal(item: CardI): Promise<any> {
    const response = await lastValueFrom(
      this._dialog
        .open(AddModalComponent, {
          data: item,
          width: '400px',
        })
        .afterClosed()
    );
    return response;
  }

  async addChild(): Promise<void> {
    const card = {
      title: this.card.title + '.' + (this.card.cards?.length + 1),
      description: '',
      type: this.card.type,
      isChild: true,
      cards: [],
    };
    const response = await this.setModal(card);
    if (!response) return;
    card.description = response.description;
    this.card.cards?.push(card);
  }

  onDelete(item: CardI): void {
    this.card.cards = this.card.cards?.filter((c) => c !== item);
  }

  canViewComponentBtn(): boolean {
    return (
      !this.parentIsComponent && !this.isComponent && !this.aChildIsComponent
    );
  }

  async deleteThis(): Promise<void> {
    const response = await this._alertService.showConfirmation(
      {
        message: '¿Desea eliminar esta tarjeta, en caso de tener Sub-' +
          this.getTitleStr() +
          's, se eliminarán también?'
      });
    if (!response) return;
    this.delete.emit(this.card);
  }

  async changeCategory(type: TypeCardEnum): Promise<void> {
    this.card.type = type;
  }
}
