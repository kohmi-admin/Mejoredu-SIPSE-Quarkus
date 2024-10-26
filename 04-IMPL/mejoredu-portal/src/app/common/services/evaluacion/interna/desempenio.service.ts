import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IDesempenioPayload,
  IDesempenioResponse,
} from '@common/interfaces/evaluacion/interna/desempenio.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DesempenioService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.evaluacion.host}${environment.endpoints.evaluacion.evaluacionInterna.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createDesempenio(data: IDesempenioPayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.evaluacionInterna.desempenioRegistrar
      )}`,
      data,
      { headers }
    );
  }

  getDesempenios(anhio: string) {
    const headers = this.getHeaders();
    return this.http.get<IDesempenioResponse>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.evaluacionInterna.desempenioConsultar
      )}?anhio=${anhio}`,
      {
        headers,
      }
    );
  }

  deleteDesempenio(idDesempenio: number) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.evaluacionInterna.desempenioEliminar.replace(
          '{id}',
          `${idDesempenio}`
        )
      )}`,
      {
        headers,
      }
    );
  }
}
