import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IEvidenciaPayload,
  IEvidenciaResponse,
} from '@common/interfaces/evaluacion/interna/evidencia.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EvidenciaService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.evaluacion.host}${environment.endpoints.evaluacion.evaluacionInterna.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createEvidencia(data: IEvidenciaPayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.evaluacionInterna
          .evidenciaAutoRegistrar
      )}`,
      data,
      { headers }
    );
  }

  getEvidencias(anhio: string, trimestre: string) {
    const headers = this.getHeaders();
    return this.http.get<IEvidenciaResponse>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.evaluacionInterna
          .evidenciaAutoConsultar
      )}?anhio=${anhio}&trimestre=${trimestre}`,
      {
        headers,
      }
    );
  }

  deleteEvidencia(idEvidencia: number) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.evaluacion.evaluacionInterna.evidenciaAutoEliminar.replace(
          '{id}',
          `${idEvidencia}`
        )
      )}`,
      {},
      {
        headers,
      }
    );
  }
}
