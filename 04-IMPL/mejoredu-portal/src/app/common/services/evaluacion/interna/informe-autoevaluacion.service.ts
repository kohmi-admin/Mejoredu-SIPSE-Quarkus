import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IInformeAutoPayload,
  IInformeAutoResponse,
} from '@common/interfaces/evaluacion/interna/informe-autoevaluacion.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InformeAutoevaluacionService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.evaluacion.host}${environment.endpoints.evaluacion.evaluacionInterna.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createInforme(data: IInformeAutoPayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.evaluacionInterna.informeAutoRegistrar
      )}`,
      data,
      { headers }
    );
  }

  getInformes(anhio: string, trimestre: string) {
    const headers = this.getHeaders();
    return this.http.get<IInformeAutoResponse>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.evaluacionInterna.informeAutoConsultar
      )}?anhio=${anhio}&trimestre=${trimestre}`,
      {
        headers,
      }
    );
  }

  deleteInforme(idInforme: number) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.evaluacionInterna.informeAutoEliminar.replace(
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
