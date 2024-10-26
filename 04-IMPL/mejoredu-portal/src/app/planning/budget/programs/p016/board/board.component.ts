import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CardI } from './interfaces/card.interface';
import { TypeCardEnum } from './enums/type.enum';
import { ListI } from './interfaces/list.interface';
import { AlertService } from '@common/services/alert.service';
import { lastValueFrom } from 'rxjs';
import { AddModalComponent } from './components/card/add-modal/add-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { BoardService } from './services/board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() leftName: string = 'CAUSAS';
  @Input() rightName: string = 'EFECTOS';
  @Input() inputName: 'Problema Central' | 'Propósito' = 'Problema Central';
  @Input() lists: ListI[] = [];
  @Input() listsE: ListI[] = [];
  @Input() inputText: string = '';

  test: string = '';

  constructor(
    private _alertService: AlertService,
    private _dialog: MatDialog,
    private _boardService: BoardService
  ) { }

  get canEdit(): boolean {
    return this._boardService.canEdit;
  }

  get canAdd(): boolean {
    return this._boardService.canAdd;
  }

  get editableInput(): boolean {
    return this._boardService.editableInput;
  }

  getInputIndicatorColor() {
    return this.inputName === 'Problema Central' ? 'orange' : 'green';
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

  async addCausa() {
    if (
      this.lists.length > 0 &&
      this.lists[this.lists.length - 1].cards[0].description === ''
    ) {
      this._alertService.showAlert(
        'Debes llenar la información de la causa anterior antes de crear una nueva'
      );
      return;
    }
    const card = {
      title: '' + (this.lists.length + 1),
      description: ``,
      type: TypeCardEnum.CAUSA,
      isChild: false,
      cards: [],
    };
    const response = await this.setModal(card);
    if (!response) return;
    card.description = response.description;
    const cards = {
      cards: [card],
    };
    this.lists.push(cards);
  }

  onDeleteCausa(item: CardI): void {
    this.lists = this.lists.filter((c) => c.cards.find((i) => i !== item));
  }

  onDeleteCausaE(item: CardI): void {
    this.listsE = this.listsE.filter((c) => c.cards.find((i) => i !== item));
  }

  async addEfecto() {
    if (
      this.listsE.length > 0 &&
      this.listsE[this.listsE.length - 1].cards[0].description === ''
    ) {
      this._alertService.showAlert(
        'Debes llenar la información del efecto anterior antes de crear una nueva'
      );
      return;
    }
    const card = {
      title: '' + (this.listsE.length + 1),
      description: ``,
      type: TypeCardEnum.EFECTO,
      isChild: false,
      cards: [],
    };
    const response = await this.setModal(card);
    if (!response) return;
    card.description = response.description;
    const cards = {
      cards: [card],
    };
    this.listsE.push(cards);
  }

  async getValuesBoard() {
    return {
      causas: this.lists,
      efectos: this.listsE,
      medios: this.lists,
      fines: this.listsE,
      programaCentral: this.inputText,
    };
  }
}
