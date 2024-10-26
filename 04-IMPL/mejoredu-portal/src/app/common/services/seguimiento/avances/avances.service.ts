import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRegistrarMetaVAItem } from '@common/interfaces/seguimiento/avances-metasVA.interface';
import {
  IConsultaAvance,
  IConsultaEvidenciaMensual,
  IConsultaEvidenciaTrimestral,
  IConsultarActividades,
  IConsultarPAA,
  IConsultarProductos,
  IDTOEvidenciaMensual,
  IDTOEvidenciaTrimestral,
  IDTOProductoNoProgramado,
  IDTORegistrarEntregables,
  IRegistrarEntregables,
  IRegistrarEvidenciaMensual,
  IRegistrarEvidenciaTrimestral,
  IRegistrarMetaVA,
  IResponseProductoNoProgramado,
} from '@common/interfaces/seguimiento/avances.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AvancesService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.seguimiento.seguimientoAnual.avances.host}`;
  private hostConfiguration =
    environment.endpoints.seguimiento.seguimientoAnual.avances;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  consultarAvancesPorAnhio(anhio: number): Observable<any> {
    const headers = this.getHeaders();
    const params = {
      anhio,
    };
    return this.http.get<any>(
      `${this.basePath.concat(
        this.hostConfiguration.consultarAvancesPorAnhio
      )}`,
      {
        headers,
        params,
      }
    );
  }

  consultarAvance(idProducto: number): Observable<IConsultaAvance> {
    const headers = this.getHeaders();
    return this.http.get<IConsultaAvance>(
      `${this.basePath.concat(
        this.hostConfiguration.consultarAvance
      )}${idProducto}/`,
      {
        headers,
      }
    );
  }

  consultarEvidenciaMensual(
    idProducto: number,
    mes: number
  ): Observable<IConsultaEvidenciaMensual> {
    const headers = this.getHeaders();
    let urlBase = this.basePath.concat(
      this.hostConfiguration.consultarEvidenciaMensual
    );
    let url = mes == null ? `${idProducto}` : `${idProducto}/${mes}`;
    return this.http.get<IConsultaEvidenciaMensual>(urlBase + url, {
      headers,
    });
  }

  consultarEvidenciaTrimestral(
    idProducto: number,
    trimestre?: number | null
  ): Observable<any> {
    const headers = this.getHeaders();
    let baseUrl =
      this.basePath + this.hostConfiguration.consultarEvidenciaTrimestral;
    let url = trimestre == null ? idProducto : `${idProducto}/${trimestre}`;
    return this.http.get<IConsultaEvidenciaTrimestral>(baseUrl + url, {
      headers,
    });
  }

  consultarPAA(cveUsuario, idAnhio: number, trimestre): Observable<any> {
    const headers = this.getHeaders();
    const urlTrimestre = trimestre == null ? '' : `&trimestre=${trimestre}`;
    return this.http.get<any>(
      `${this.basePath
        .concat(this.hostConfiguration.consultarPAA)
        .replace(
          'avance-programatico',
          ''
        )}?cveUsuario=${cveUsuario}&idAnhio=${idAnhio}${urlTrimestre}`,
      {
        headers,
      }
    );
  }

  consultarPaaIdUnidad(idUnidad: number, idAnhio: number) {
    const headers = this.getHeaders();
    const params = {
      idAnhio: idAnhio,
      idUnidad: idUnidad,
    };
    return this.http.get<any>(
      this.basePath
        .concat(this.hostConfiguration.consultarPaaIdUnidad)
        .replace('avance-programatico/', ''),
      {
        headers,
        params,
      }
    );
  }

  registrarEntregables(
    data: IDTORegistrarEntregables
  ): Observable<IRegistrarEntregables> {
    const headers = this.getHeaders();
    return this.http.post<IRegistrarEntregables>(
      `${this.basePath.concat(this.hostConfiguration.registrarEntregables)}`,
      data,
      {
        headers,
      }
    );
  }

  regustrarMetaVA(
    data: IRegistrarMetaVAItem,
    cveUsuario: string
  ): Observable<IRegistrarMetaVA> {
    const headers = this.getHeaders();
    return this.http.post<IRegistrarMetaVA>(
      `${this.basePath.concat(
        this.hostConfiguration.registrarMetaVA
      )}/${cveUsuario}`,
      data,
      {
        headers,
      }
    );
  }

  registroEvidenciaMensual(
    cveUsuario: string,
    data: IDTOEvidenciaMensual
  ): Observable<IRegistrarEvidenciaMensual> {
    const headers = this.getHeaders();
    return this.http.post<IRegistrarEvidenciaMensual>(
      `${this.basePath.concat(
        this.hostConfiguration.registroEvidenciaMensual
      )}${cveUsuario}/`,
      data,
      {
        headers,
      }
    );
  }

  registroEvidenciaTrimestral(
    cveUsuario: string,
    data: IDTOEvidenciaTrimestral
  ): Observable<IRegistrarEvidenciaTrimestral> {
    const headers = this.getHeaders();
    return this.http.post<IRegistrarEvidenciaTrimestral>(
      `${this.basePath.concat(
        this.hostConfiguration.registroEvidenciaTrimestral
      )}${cveUsuario}`,
      data,
      {
        headers,
      }
    );
  }

  registroProductoNoProgramado(
    data: IDTOProductoNoProgramado
  ): Observable<IResponseProductoNoProgramado> {
    const headers = this.getHeaders();
    return this.http.post<IResponseProductoNoProgramado>(
      `${this.basePath.concat(
        this.hostConfiguration.registroProductoNoProgramado
      )}`,
      data,
      {
        headers,
      }
    );
  }

  consultarProductos(
    idActividad: number,
    trimestre: number
  ): Observable<IConsultarProductos> {
    const headers = this.getHeaders();
    const urlTrimestre = trimestre == null ? '' : `&trimestre=${trimestre}`;

    return this.http.get<IConsultarProductos>(
      `${environment.endpoints.seguimiento.seguimientoAnual.avances.hostBase.concat(
        this.hostConfiguration.consultarProductos
      )}?idActividad=${idActividad}${urlTrimestre}`,
      {
        headers,
      }
    );
  }

  consultarProyectos(
    cveUsuario: string,
    idAnhio: number
  ): Observable<IConsultarPAA> {
    const headers = this.getHeaders();
    const params = {
      cveUsuario,
      idAnhio,
    };
    return this.http.get<IConsultarPAA>(
      `${environment.endpoints.seguimiento.seguimientoAnual.avances.hostBase.concat(
        this.hostConfiguration.consultarPAA
      )}`,
      {
        headers,
        params,
      }
    );
  }

  consultarActividades(
    idProyecto: string,
    trimestre?: number
  ): Observable<any> {
    const headers = this.getHeaders();
    const trimestreUrl = trimestre == null ? '' : `&trimestre=${trimestre}`;
    return this.http.get<any>(
      `${environment.endpoints.seguimiento.seguimientoAnual.avances.hostBase.concat(
        this.hostConfiguration.consultarActividades
      )}?idproyecto=${idProyecto}${trimestreUrl}`,
      {
        headers,
      }
    );
  }

  consultarActividadesPorAnhio(
    anhio: number,
    tipoRegistro: any,
    trimestre: any
  ): Observable<IConsultarActividades> {
    const headers = this.getHeaders();
    const params = {
      anhio,
      tipoRegistro,
      trimestre,
    };
    Object.keys(params).forEach((key) => {
      if (params[key] === null || params[key] == '') delete params[key];
    });
    return this.http.get<IConsultarActividades>(
      `${environment.endpoints.seguimiento.seguimientoAnual.avances.hostBase.concat(
        this.hostConfiguration.consultarActividadesPorAnhio
      )}`,
      {
        headers,
        params,
      }
    );
  }

  productosNoProgramados(
    data: IDTOProductoNoProgramado,
    cveUsuario: string
  ): Observable<IRegistrarEntregables> {
    const headers = this.getHeaders();
    return this.http.post<IRegistrarEntregables>(
      `${environment.endpoints.seguimiento.seguimientoAnual.avances.hostBase.concat(
        this.hostConfiguration.productosNoProgramados
      )}/${cveUsuario}`,
      data,
      {
        headers,
      }
    );
  }

  enviarProyectoRevision(data: any) {
    let params = {
      trimestre: data.trimestre,
      idProyecto: data.idProyecto,
    };
    let url = `${environment.endpoints.seguimiento.seguimientoAnual.avances.hostBase}${environment.endpoints.seguimiento.seguimientoAnual.avances.enviarProyectoRevision}`;
    const headers = this.getHeaders();
    return this.http.post<IRegistrarEntregables>(url, data, {
      headers,
      params,
    });
  }

  eliminarAvance(idActividad: number) {
    let url = `${environment.endpoints.seguimiento.seguimientoAnual.avances.hostBase}${environment.endpoints.seguimiento.seguimientoAnual.avances.eliminarAvance}${idActividad}`;
    const headers = this.getHeaders();
    return this.http.put<any>(url, {
      headers,
    });
  }
}
