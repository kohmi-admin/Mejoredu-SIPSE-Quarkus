import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IInformeResponse,
  IInformesPayload,
} from '@common/interfaces/evaluacion/externa/informes.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InformesService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.evaluacion.host}${environment.endpoints.evaluacion.evaluacionExterna.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createInforme(data: IInformesPayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.evaluacionExterna.informesResgistrar
      )}`,
      data,
      { headers }
    );
  }

  getInformes(anhio: string) {
    const headers = this.getHeaders();
    return this.http.get<IInformeResponse>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.evaluacionExterna.informesConsultar
      )}?anio=${anhio}`,
      {
        headers,
      }
    );
  }

  deleteInforme(idInforme: number) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.evaluacionExterna.informesEliminar.replace(
          '{id}',
          `${idInforme}`
        )
      )}`,
      {
        headers,
      }
    );
  }
}
