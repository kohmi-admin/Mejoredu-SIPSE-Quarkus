import { Pipe, PipeTransform } from '@angular/core';
import { IResponseConsultarPAA } from '@common/interfaces/seguimiento/avances.interface';

@Pipe({
  name: 'estatuspaaterminado'
})
export class EstatuspaaterminadoPipe implements PipeTransform {

  transform(value: IResponseConsultarPAA[]): IResponseConsultarPAA[] {
    return value.filter((proyecto: IResponseConsultarPAA) =>{ return proyecto.estatus == "O"});
  }

}
