import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IP016ProblemTreePayload, IP016ProblemTreeResponse } from '@common/interfaces/budget/p016/problem-tree.interface';

import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class P016ProblemTreeService {

  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.presupuestarios.host}${environment.endpoints.planeacion.presupuestarios.arbolProblema.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  registrarArbolProblema(data: IP016ProblemTreePayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.arbolProblema
          .registrar
      )}`,
      data,
      { headers }
    );
  }

  getArbolProblemaoPorAnhio(year: string) {
    const headers = this.getHeaders();
    return this.http.get<IP016ProblemTreeResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.arbolProblema
          .consultaPorAnhio
      )}${year}`,
      {
        headers,
      }
    );
  }
}
