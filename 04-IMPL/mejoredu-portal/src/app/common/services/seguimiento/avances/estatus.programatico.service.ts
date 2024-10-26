import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IConsultaProyectosEPP, IDTOConsultaProyectos } from '@common/interfaces/seguimiento/estatus-pp.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstatusProgramaticoService {
  constructor(private http: HttpClient) {}

  private basePath = `${environment.endpoints.seguimiento.seguimientoAnual.estatusPP.host}`;
  private hostConfiguration =
    environment.endpoints.seguimiento.seguimientoAnual.estatusPP;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  consultarProyectosEPP(term: IDTOConsultaProyectos): Observable<any> {
    const headers = this.getHeaders();
    const params = {
      ...term,
    };
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] == "") delete params[key];
   });
    return this.http.get<any>(
      `${this.basePath.concat(
        this.hostConfiguration.proyectos,
      )}`,
      {
        headers,
        params
      }
    );
  }

  consultarActividadesByIdProyecto(idProyecto: number, trimestre?: number): Observable<any> {
    const headers = this.getHeaders();
    const trimestreUrl = trimestre == null ? "" : `?trimestre=${trimestre}`
    return this.http.get<IConsultaProyectosEPP>(
      `${this.basePath.concat(
        this.hostConfiguration.actividades,
        `/${idProyecto}/actividades${trimestreUrl}`
      )}`,
      {
        headers
      }
    );
  }

  consultarProductosByIdActividad(idActividad: number, trimestre?: number): Observable<any> {
    const headers = this.getHeaders();
    const trimestreUrl = trimestre == null ? "" : `?trimestre=${trimestre}`
    return this.http.get<IConsultaProyectosEPP>(
      `${this.basePath.concat(
        this.hostConfiguration.productos,
        `/${idActividad}/productos${trimestreUrl}`
      )}`,
      {
        headers
      }
    );
  }

  consultarDatosGenerales(idProducto: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<IConsultaProyectosEPP>(
      `${this.basePath.concat(
        this.hostConfiguration.datosGenerales,
        `/${idProducto}`
      )}`,
      {
        headers
      }
    );
  }
}
