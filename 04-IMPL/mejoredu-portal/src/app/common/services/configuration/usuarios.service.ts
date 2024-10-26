import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUsuarioPayload } from '@common/interfaces/configuration/usuarios.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.auth.host2}${environment.endpoints.auth.usuarios.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createUsuario(data: IUsuarioPayload){
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.auth.usuarios.registrar
      )}`,
      data,
      { headers }
    );
  }

  getAllUsuarios(){
    const headers = this.getHeaders();
    return this.http.get<IUsuarioPayload[]>(
      `${this.basePath.concat(
        environment.endpoints.auth.usuarios.consultarTodos
      )}`,
      {
        headers,
      }
    );
  }

  updateUsuario(cveUsuario?: string, data?: any) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.auth.usuarios.modificar
      )}${cveUsuario}`,
      data,
      { headers }
    );
  }

  deleteUsuario(cveUsuario?: string) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.auth.usuarios.eliminar
      )}${cveUsuario}`,
      { headers }
    );
  }
}
