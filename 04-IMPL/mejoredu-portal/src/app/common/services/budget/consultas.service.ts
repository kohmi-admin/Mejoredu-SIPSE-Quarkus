import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IConsultaResponse,
  IItemConsultaResponse,
} from '@common/interfaces/budget/consultas.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PPConsultasService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.presupuestarios.host}${environment.endpoints.planeacion.presupuestarios.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  getConsultaPorAnhio(year: string, withFiles?: boolean) {
    const headers = this.getHeaders();
    const consultarArchivos = withFiles ? '?consultarArchivos=true' : '';
    return this.http.get<IConsultaResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.consultas
          .consultaPorAnhio
      )}${year}${consultarArchivos}`,
      {
        headers,
      }
    );
  }

  getConsultaPorProgramaYAnhio(year: string, programa: string) {
    return new Promise<IItemConsultaResponse>((resolve, reject) => {
      this.getConsultaPorAnhio(year).subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            const finded = value.respuesta.filter(
              (item) => item.clave === programa
            );
            if (finded.length) {
              resolve(finded[0]);
            } else {
              reject(null);
            }
          } else {
            reject(null);
          }
        },
        error: (err) => {
          reject(null);
        },
      });
    });
  }

  finalizarRegistro(idPrograma: number, cveUsuario: string) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.consultas
          .finalizarRegistro
      )}`,
      // )}${idEstructura}/${cveUsuario}`,
      {
        id: idPrograma,
        usuario: cveUsuario,
      },
      {
        headers,
      }
    );
  }

  enviarARevison(idPrograma: number, cveUsuario: string) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.consultas
          .enviarARevisar
      )}`,
      // )}${idEstructura}/${cveUsuario}`,
      {
        id: idPrograma,
        usuario: cveUsuario,
      },
      { headers }
    );
  }
}
