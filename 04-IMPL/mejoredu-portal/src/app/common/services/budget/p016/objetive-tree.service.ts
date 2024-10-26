import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IP016ObjetiveTreePayload, IP016ObjetiveTreeResponse } from '@common/interfaces/budget/p016/objetive-tree.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class P016ObjetiveTreeService {

  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.presupuestarios.host}${environment.endpoints.planeacion.presupuestarios.arbolObjetivos.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  registrarArbolObjetivo(data: IP016ObjetiveTreePayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.arbolObjetivos
          .registrar
      )}`,
      data,
      { headers }
    );
  }

  getArbolObjetivoPorAnhio(year: string) {
    const headers = this.getHeaders();
    return this.http.get<IP016ObjetiveTreeResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.arbolObjetivos
          .consultaPorAnhio
      )}${year}`,
      {
        headers,
      }
    );
  }
}
