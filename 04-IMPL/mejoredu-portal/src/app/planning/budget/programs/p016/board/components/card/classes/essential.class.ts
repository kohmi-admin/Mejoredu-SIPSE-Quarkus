import { TypeCardEnum } from '../../../enums/type.enum';
import { CardI } from '../../../interfaces/card.interface';
import { CardService } from '../services/card.service';

export class Essential {
  card!: CardI;

  constructor(private _cardService: CardService) {}

  getPrefix(): string {
    return this._cardService.getPrefix(this.card?.type);
  }

  getTitleStr(): string {
    return this._cardService.getTitleStr(this.card?.type);
  }

  getAddStr(): string {
    return this._cardService.getAddStr(this.card?.type);
  }

  canDelete(): boolean {
    return this._cardService.canDelete(this.card?.type);
  }

  canMarkFin(): boolean {
    return this._cardService.canMarkFin(this.card?.type);
  }

  canMarkNoFin(): boolean {
    return this._cardService.canMarkNoFin(this.card?.type);
  }

  canCategorize(): boolean {
    return this._cardService.canCategorize(this.card?.type);
  }

  getColor(): string {
    switch (this.card?.type) {
      case TypeCardEnum.CAUSA:
        return 'green';
      case TypeCardEnum.EFECTO:
        return 'blue';
      case TypeCardEnum.MEDIO:
        return 'grey';
      case TypeCardEnum.FIN:
        return 'blue';
      case TypeCardEnum.COMPONENTE:
        return 'purple';
      case TypeCardEnum.ACTIVIDAD:
        return 'pink';
      default:
        return 'grey';
    }
  }

  get isComponent(): boolean {
    return this.card?.type === TypeCardEnum.COMPONENTE;
  }

  get isActivity(): boolean {
    return this.card?.type === TypeCardEnum.ACTIVIDAD;
  }

  get isMedio(): boolean {
    return this.card?.type === TypeCardEnum.MEDIO;
  }

  get aChildIsComponent(): boolean {
    const isComponentInChildren = (cards: CardI[] | undefined): boolean => {
      if (!cards) return false;

      for (const card of cards) {
        if (card.type === TypeCardEnum.COMPONENTE) {
          return true;
        }

        if (card.cards && isComponentInChildren(card.cards)) {
          return true;
        }
      }

      return false;
    };

    return isComponentInChildren(this.card?.cards);
  }
}
