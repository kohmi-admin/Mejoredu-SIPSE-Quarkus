import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { I001FichaPayload, I001FichaResponse } from '@common/interfaces/budget/m001-and-o001/fichas.interface';
import { IP016DataGeneralPayload } from '@common/interfaces/budget/p016/data-general.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class O001FichasService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.presupuestarios.host}${environment.endpoints.planeacion.presupuestarios.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createDataGeneral(data: I001FichaPayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.o001
          .registrar
      )}`,
      data,
      { headers }
    );
  }

  getDataGeneralPorAnhio(year: string) {
    const headers = this.getHeaders();
    return this.http.get<I001FichaResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.o001
          .consultaPorAnhio
      )}${year}`,
      {
        headers,
      }
    );
  }
}
