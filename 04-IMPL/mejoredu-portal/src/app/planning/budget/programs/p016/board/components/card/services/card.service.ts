import { Injectable } from '@angular/core';
import { TypeCardEnum } from '../../../enums/type.enum';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor() { }

  getPrefix(type: TypeCardEnum): string {
    switch(type) {
      case TypeCardEnum.EFECTO:
        return 'E';
      case TypeCardEnum.CAUSA:
        return 'C';
      case TypeCardEnum.MEDIO:
        return 'M';
      case TypeCardEnum.FIN:
        return 'F';
      case TypeCardEnum.NO_FIN:
        return 'F';
      case TypeCardEnum.COMPONENTE:
        return 'C';
      case TypeCardEnum.ACTIVIDAD:
        return 'A';
      default:
        return 'D';
    }
  }

  getTitleStr(type: TypeCardEnum): string {
    switch(type) {
      case TypeCardEnum.EFECTO:
        return 'Efecto';
      case TypeCardEnum.CAUSA:
        return 'Causa';
      case TypeCardEnum.MEDIO:
        return 'Medio';
      case TypeCardEnum.FIN:
        return 'Fin';
      case TypeCardEnum.NO_FIN:
        return 'N/A';
      case TypeCardEnum.COMPONENTE:
        return 'Componente';
      case TypeCardEnum.ACTIVIDAD:
        return 'Actividad';
      default:
        return 'Desconocido';
    }
  }

  getAddStr(type: TypeCardEnum): string {
    switch(type) {
      case TypeCardEnum.EFECTO:
        return 'Sub-efecto';
      case TypeCardEnum.CAUSA:
        return 'Sub-causa';
      case TypeCardEnum.MEDIO:
        return 'Sub-medio';
      case TypeCardEnum.FIN:
        return 'Sub-fin';
      case TypeCardEnum.COMPONENTE:
        return 'Sub-componente';
      case TypeCardEnum.ACTIVIDAD:
        return 'Sub-actividad';
      default:
        return 'Desconocido';
    }
  }

  canDelete(type: TypeCardEnum): boolean {
    switch(type) {
      case TypeCardEnum.EFECTO:
        return true;
      case TypeCardEnum.CAUSA:
        return true;
      default:
        return false;
    }
  }

  canCategorize(type: TypeCardEnum): boolean {
    switch(type) {
      case TypeCardEnum.MEDIO:
        return true;
      case TypeCardEnum.COMPONENTE:
        return true;
      case TypeCardEnum.ACTIVIDAD:
        return true;
      default:
        return false;
    }
  }

  canMarkFin(type: TypeCardEnum): boolean {
    switch(type) {
      case TypeCardEnum.FIN:
        return true;
      default:
        return false;
    }
  }

  canMarkNoFin(type: TypeCardEnum): boolean {
    switch(type) {
      case TypeCardEnum.NO_FIN:
        return true;
      default:
        return false;
    }
  }
}
