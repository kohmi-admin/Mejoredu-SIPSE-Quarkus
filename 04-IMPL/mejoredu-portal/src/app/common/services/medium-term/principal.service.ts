import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGestorPorAnhioResponse } from '@common/interfaces/medium-term/principal.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrincipalService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.medianoPlazo.host}${environment.endpoints.planeacion.medianoPlazo.gestorEstructura.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createGestorEstructura(data: any) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.gestorEstructura.registrar
      )}`,
      data,
      { headers }
    );
  }

  getAllGestor() {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.gestorEstructura
          .consultarTodosInicio
      )}`,
      {
        headers,
      }
    );
  }

  getAllGestorPorAnhioPorValidar(anhio: string) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.gestorEstructura
          .consultarInicioPorAnhioPorValidar
      )}${anhio}`,
      {
        headers,
      }
    );
  }

  updateGestorEstructura(idEstructura: number, data: any) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.gestorEstructura.modificar
      )}${idEstructura}`,
      data,
      { headers }
    );
  }

  deleteGestorEstructura(idEstructura: string, cveUsuario: string) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.gestorEstructura.eliminar
      )}${idEstructura}/${cveUsuario}`,
      {},
      { headers }
    );
  }

  getGestorPorAnhio(year: string) {
    const headers = this.getHeaders();
    return this.http.get<IGestorPorAnhioResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.gestorEstructura
          .consultarInicioPorAnhio
      )}${year}`,
      {
        headers,
      }
    );
  }

  finalizarRegistro(idEstructura: number, cveUsuario: string) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.gestorEstructura.finalizarRegistro
      )}${idEstructura}/${cveUsuario}`,
      {},
      {
        headers,
      }
    );
  }

  enviarARevison(idEstructura: number, cveUsuario: string) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.medianoPlazo.gestorEstructura.enviarARevisar
      )}${idEstructura}/${cveUsuario}`,
      {},
      { headers }
    );
  }

  getGeneralReportByAnhio(anhio) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath}/epilogo/consultarReporte/${anhio}`,
      { headers }
    );
  }
}
