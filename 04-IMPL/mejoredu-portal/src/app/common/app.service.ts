import { Injectable } from '@angular/core';
import { CurrentUserI } from './interfaces/user.interface';
import * as SecureLS from 'secure-ls';
import { IDatosUsuario } from './interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  ls = new SecureLS({ encodingType: 'aes' });
  user!: IDatosUsuario;


  constructor() {
    const dataUser: IDatosUsuario = this.ls.get('dUaStEaR');
    this.user = dataUser;
    // this.user = {
    //   userId: String(dataUser.persona.idPersona),
    //   userName: dataUser.cveUsuario,
    //   email: dataUser.persona.cxCorreo,
    //   firstName: dataUser.persona.cxNombre,
    //   lastName: dataUser.persona.cxPrimerApellido,
    //   functionalities: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    // }
  }
}
