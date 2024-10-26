import { Injectable } from '@angular/core';

export enum ROLE {
  'Administrador' = 'Administrador',
  'Planeación' = 'Planeación',
  'Presupuesto' = 'Presupuesto',
  'Supervisor' = 'Supervisor',
  'Enlace' = 'Enlace',
}

@Injectable({
  providedIn: 'root'
})
export class SimulateAuthService {
  private _role: ROLE = ROLE.Administrador;

  constructor() { }

  set role(roleName: ROLE) {
    roleName = this.verifyIfStringIsRole(roleName);
    this._role = roleName;
    this.saveRoleInLocalStorage(roleName);
  }

  get role(): ROLE {
    return this.getRoleFromLocalStorage() || this._role;
  }

  saveRoleInLocalStorage(roleName: ROLE) {
    localStorage.setItem('role', roleName);
  }

  getRoleFromLocalStorage(): ROLE {
    return localStorage.getItem('role') as ROLE;
  }
  
  verifyIfStringIsRole(roleName: string): ROLE {
    if(Object.values(ROLE).includes(roleName as ROLE)) {
      return roleName as ROLE;
    }
    return ROLE.Administrador;
  }
}
