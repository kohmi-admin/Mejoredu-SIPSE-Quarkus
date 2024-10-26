import { MODIFICATION_TYPE } from '../../enum/modification.enum';
import { TIPO_ADECUACION } from '../../enum/tipoAdecuacion.enum';
import { SwitchI } from '../interfaces/switch.interface';
import { switches } from '../utils/switches.const';
import { getModificationType } from '../utils/utils';

export const actived = {
  project: 0,
  activities: 0,
  products: 0,
  actions: 0,
  budgets: 0,
};
export class SwitchManage {
  switches: SwitchI[] = [];
  tipoAdecuacion: number = 0;

  establishAllSwitches(active: boolean): void {
    this.switches.forEach((switchItem: SwitchI) => {
      switchItem.alta.enable = active;
      switchItem.alta.value = false;
      switchItem.modificacion.enable = active;
      switchItem.modificacion.value = false;
      switchItem.cancelacion.enable = active;
      switchItem.cancelacion.value = false;
      switchItem.ampliacion.enable = active;
      switchItem.ampliacion.value = false;
      switchItem.reduccion.enable = active;
      switchItem.reduccion.value = false;
      switchItem.reintegro.enable = active;
      switchItem.reintegro.value = false;
      switchItem.traspaso.enable = active;
      switchItem.traspaso.value = false;
    });
  }

  switchChange(level: string, type: string, event: boolean): void {
    if (level === 'Proyecto') {
      this.switches.forEach((switchesItem: SwitchI) => {
        if (type === 'alta') {
          if (switchesItem.type !== 'Proyecto') {
            switchesItem.alta.enable =
              switchesItem.type === 'Presupuesto' &&
                this.tipoAdecuacion === TIPO_ADECUACION.programatica
                ? false
                : !event;
            switchesItem.alta.value = false;
          }
          switchesItem.modificacion.enable =
            switchesItem.type === 'Presupuesto' &&
              this.tipoAdecuacion === TIPO_ADECUACION.programatica
              ? false
              : !event;
          switchesItem.modificacion.value = false;
          switchesItem.cancelacion.enable =
            switchesItem.type === 'Presupuesto' &&
              this.tipoAdecuacion === TIPO_ADECUACION.programatica
              ? false
              : !event;
          switchesItem.cancelacion.value = false;
        }
        if (type === 'modificacion') {
          if (switchesItem.type !== 'Proyecto') {
            switchesItem.modificacion.enable =
              switchesItem.type === 'Presupuesto' &&
                this.tipoAdecuacion === TIPO_ADECUACION.programatica
                ? false
                : !event;
            switchesItem.modificacion.value = false;
          }
          switchesItem.alta.enable =
            switchesItem.type === 'Presupuesto' &&
              this.tipoAdecuacion === TIPO_ADECUACION.programatica
              ? false
              : !event;
          switchesItem.alta.value = false;
          switchesItem.cancelacion.enable =
            switchesItem.type === 'Presupuesto' &&
              this.tipoAdecuacion === TIPO_ADECUACION.programatica
              ? false
              : !event;
          switchesItem.cancelacion.value = false;
        }
        if (type === 'cancelacion') {
          if (switchesItem.type !== 'Proyecto') {
            switchesItem.cancelacion.enable =
              switchesItem.type === 'Presupuesto' &&
                this.tipoAdecuacion === TIPO_ADECUACION.programatica
                ? false
                : !event;
            switchesItem.cancelacion.value = false;
          }
          switchesItem.alta.enable =
            switchesItem.type === 'Presupuesto' &&
              this.tipoAdecuacion === TIPO_ADECUACION.programatica
              ? false
              : !event;
          switchesItem.alta.value = false;
          switchesItem.modificacion.enable =
            switchesItem.type === 'Presupuesto' &&
              this.tipoAdecuacion === TIPO_ADECUACION.programatica
              ? false
              : !event;
          switchesItem.modificacion.value = false;
        }
      });
    }

    if (type === 'alta') {
      let pointer: boolean = false;
      this.switches.forEach((switchItem: SwitchI) => {
        if (
          this.tipoAdecuacion === TIPO_ADECUACION.programatica &&
          switchItem.type === 'Presupuesto'
        ) {
          return;
        }
        if (!event) {
          switchItem.alta.enable = true;
        }
        if (switchItem.type === level) {
          pointer = event;
        }
        switchItem.alta.value = pointer;
        if (pointer && switchItem.type !== level) {
          switchItem.alta.enable = false;
        }
      });
    }

    const findLevel = (item) => {
      return item.type === level;
    };

    if (!event) {
      const findedIndex = switches.findIndex(findLevel);
      if (MODIFICATION_TYPE[type] === +actived[switches[findedIndex].key]) {
        actived[switches[findedIndex].key] = getModificationType(
          switches[findedIndex]
        );
      }
    }
  }

  enableProgramaticsBudgets(): void {
    this.establishAllSwitches(false);
    this.switches.forEach((switchItem: SwitchI) => {
      if (switchItem.type === 'Presupuesto') {
        switchItem.alta.enable = true;
        switchItem.modificacion.enable = true;
        switchItem.cancelacion.enable = true;
        switchItem.ampliacion.enable = true;
        switchItem.reduccion.enable = true;
        switchItem.reintegro.enable = true;
        switchItem.traspaso.enable = true;
        return;
      }
      switchItem.alta.enable = true;
      switchItem.modificacion.enable = true;
      switchItem.cancelacion.enable = true;
    });
  }

  enableProgramatics(): void {
    this.establishAllSwitches(false);
    this.switches.forEach((switchItem: SwitchI) => {
      if (switchItem.type === 'Presupuesto') {
        return;
      }
      switchItem.alta.enable = true;
      switchItem.modificacion.enable = true;
      switchItem.cancelacion.enable = true;
    });
  }

  enableOnlyBudgets(): void {
    this.establishAllSwitches(false);
    this.switches.forEach((switchItem: SwitchI) => {
      if (switchItem.type === 'Presupuesto') {
        switchItem.alta.enable = true;
        switchItem.modificacion.enable = true;
        switchItem.cancelacion.enable = true;
        switchItem.ampliacion.enable = true;
        switchItem.reduccion.enable = true;
        switchItem.reintegro.enable = true;
        switchItem.traspaso.enable = true;
        return;
      }
      switchItem.alta.enable = false;
      switchItem.modificacion.enable = false;
      switchItem.cancelacion.enable = false;
      switchItem.ampliacion.enable = false;
      switchItem.reduccion.enable = false;
      switchItem.reintegro.enable = false;
      switchItem.traspaso.enable = false;
    });
  }

  getAllKeys(switchItem: SwitchI) {
    return Object.keys(switchItem);
  }
}
