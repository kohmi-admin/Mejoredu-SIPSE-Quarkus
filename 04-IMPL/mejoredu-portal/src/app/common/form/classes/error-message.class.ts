import { AbstractControl } from '@angular/forms';

export const getErrorMessage = (label: string, control: any) => {
  if (control.valid) {
    return null;
  }

  if (control.hasError('required')) {
    return `El campo es requerido`;
  }

  if (control.hasError('email')) {
    return `Debe ser un correo electrónico válido`;
  }

  if (control.hasError('pattern')) {
    return `El formato de ${label} no es válido`;
  }

  if (control.hasError('minlength')) {
    return `Debe tener al menos ${control.errors?.minlength.requiredLength} caracteres`;
  }

  if (control.hasError('maxlength')) {
    return `No debe exceder los ${control.errors?.maxlength.requiredLength} caracteres`;
  }

  if (control.hasError('min')) {
    return `Debe ser mayor o igual a ${control.errors?.min.min}`;
  }

  if (control.hasError('max')) {
    return `Debe ser menor o igual a ${control.errors?.max.max}`;
  }

  if (control.hasError('invalidPassword')) {
    return `Contraseña: 8+ caracteres, mayúscula, minúscula, número y carácter especial.`;
  }

  if (control.hasError('uppercase')) {
    return `Debe contener al menos una letra mayúscula`;
  }

  if (control.hasError('lowercase')) {
    return `Debe contener al menos una letra minúscula`;
  }

  if (control.hasError('digit')) {
    return `Debe contener al menos un número`;
  }

  if (control.hasError('specialChar')) {
    return `Debe contener al menos un carácter especial`;
  }

  if (control.hasError('passwordMismatch')) {
    return `Las contraseñas no coinciden`;
  }

  return 'Valor inválido';
};
