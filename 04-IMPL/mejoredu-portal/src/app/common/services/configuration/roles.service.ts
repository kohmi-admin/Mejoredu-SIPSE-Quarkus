import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRolePayload, IRolesResponse } from '@common/interfaces/configuration/roles.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.auth.host2}${environment.endpoints.auth.roles.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createRole(data: IRolePayload){
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.auth.roles.registrar
      )}`,
      data,
      { headers }
    );
  }

  getAllRoles(){
    const headers = this.getHeaders();
    return this.http.get<IRolesResponse[]>(
      `${this.basePath.concat(
        environment.endpoints.auth.roles.consultarTodos
      )}`,
      {
        headers,
      }
    );
  }

  getRoleById(idRole: number){
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.auth.roles.consultarPorId
      )}${idRole}`,
      {
        headers,
      }
    );
  }

  updateRole(idRole?: number, data?: any) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.auth.roles.modificar
      )}${idRole}`,
      data,
      { headers }
    );
  }

  deleteRole(idRole: number) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.auth.roles.eliminar
      )}${idRole}`,
      { headers }
    );
  }

}
