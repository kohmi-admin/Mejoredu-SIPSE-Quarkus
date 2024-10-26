import { Injectable } from '@angular/core';

@Injectable()
export abstract class ValidateService {

  abstract getData(termino: {
    module: string;
    submodule: string;
    id: any;
  }): any[];

  abstract saveData(termino: {
    module: string;
    submodule: string;
    id: any;
    data: any;
  }): boolean;

}
