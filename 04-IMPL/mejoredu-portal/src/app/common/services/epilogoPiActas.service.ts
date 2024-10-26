import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IEpilogoPayload,
  IEpilogoResponsePorIdEstructura,
} from '@common/interfaces/epilogo.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EpilogoPiActasService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.medianoPlazo.host}${environment.endpoints.planeacion.medianoPlazo.epilogoPiActas.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  registrarEpilogo(data: IEpilogoPayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.epilogoPiActas.registrar
      )}`,
      data,
      {
        headers,
      }
    );
  }

  getEpilogoPorIdEstructura(idEstructura: string) {
    const headers = this.getHeaders();
    return this.http.get<IEpilogoResponsePorIdEstructura>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.epilogoPiActas
          .consultarPorIdEstructura
      )}${idEstructura}`,
      {
        headers,
      }
    );
  }
}
