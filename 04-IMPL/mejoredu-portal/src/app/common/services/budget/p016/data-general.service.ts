import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IP016DataGeneralPayload, IP016DataGeneralResponse } from '@common/interfaces/budget/p016/data-general.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class P016DataGeneralService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.presupuestarios.host}${environment.endpoints.planeacion.presupuestarios.datosGenerales.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createDataGeneral(data: IP016DataGeneralPayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.datosGenerales
          .registrar
      )}`,
      data,
      { headers }
    );
  }

  getDataGeneralPorAnhio(year: string) {
    const headers = this.getHeaders();
    return this.http.get<IP016DataGeneralResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.datosGenerales
          .consultaPorAnho
      )}${year}`,
      {
        headers,
      }
    );
  }

  getPPPorId(idProgramaPresupuestal: number) {
    const headers = this.getHeaders();
    return this.http.get<IP016DataGeneralResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.datosGenerales
          .consultaPorProgramaPresupuestal
      )}${idProgramaPresupuestal}`,
      {
        headers,
      }
    );
  }

  updateDataGeneral(idProgramaPresupuestal: number, data: any) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.datosGenerales
          .modificar
      )}${idProgramaPresupuestal}`,
      data,
      { headers }
    );
  }
}
