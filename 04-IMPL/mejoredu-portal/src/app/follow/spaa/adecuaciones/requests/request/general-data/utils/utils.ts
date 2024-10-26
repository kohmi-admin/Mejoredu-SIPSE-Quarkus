import { MODIFICATION_TYPE } from '../../enum/modification.enum';
import { SwitchI } from '../interfaces/switch.interface';

export const getModificationType = (optionSwitch: SwitchI): number => {
  let value = 0;
  if (optionSwitch.alta.value) {
    value = MODIFICATION_TYPE.alta;
  } else if (optionSwitch.modificacion.value) {
    value = MODIFICATION_TYPE.modificacion;
  } else if (optionSwitch.cancelacion.value) {
    value = MODIFICATION_TYPE.cancelacion;
  } else if (optionSwitch.ampliacion.value) {
    value = MODIFICATION_TYPE.ampliacion;
  } else if (optionSwitch.reduccion.value) {
    value = MODIFICATION_TYPE.reduccion;
  } else if (optionSwitch.reintegro.value) {
    value = MODIFICATION_TYPE.reintegro;
  } else if (optionSwitch.traspaso.value) {
    value = MODIFICATION_TYPE.traspaso;
  }
  return value;
};
