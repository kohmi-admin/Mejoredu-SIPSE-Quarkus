import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IP016DiagnosticoPayload, IP016DiagnosticoResponse } from '@common/interfaces/budget/p016/diagnostico.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class P016DiagnosticService {

  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.presupuestarios.host}${environment.endpoints.planeacion.presupuestarios.diagnostico.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createDiagnostico(data: IP016DiagnosticoPayload) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.diagnostico
          .registrar
      )}`,
      data,
      { headers }
    );
  }

  getDiagnosticoPorAnhio(year: string) {
    const headers = this.getHeaders();
    return this.http.get<IP016DiagnosticoResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.diagnostico
          .consultaPorAnho
      )}${year}`,
      {
        headers,
      }
    );
  }
}
