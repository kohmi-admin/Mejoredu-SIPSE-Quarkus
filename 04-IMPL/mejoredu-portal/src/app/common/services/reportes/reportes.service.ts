import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IReportesAdecuacionesResponse } from '@common/interfaces/reportes/reportesAdecuaciones.interface';
import { IReportesAlineadosResponse } from '@common/interfaces/reportes/reportesAlineacion.interface';
import { IReportesPAAResponse } from '@common/interfaces/reportes/reportesPAA.interface';
import { IReportesPresupuestoResponse } from '@common/interfaces/reportes/reportesPresupuesto.interface';
import { IReportesSeguimientoResponse } from '@common/interfaces/reportes/reportesSeguimiento.interface';
import { ISolSeguimientoResponse } from '@common/interfaces/seguimiento/solicitudSeguimiento';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.reportes.numeralia.host}${environment.endpoints.reportes.numeralia.reportes.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  consultaReportesPAA(anhio: string, cveUsuario: string) {
    const headers = this.getHeaders();
    return this.http.get<IReportesPAAResponse>(
      `${this.basePath.concat(
        environment.endpoints.reportes.numeralia.reportes.paaGeneral
      )}${anhio}/${cveUsuario}`,
      {
        headers,
      }
    );
  }

  consultaAlineacion(anhio: string, cveUsuario: string) {
    const headers = this.getHeaders();
    return this.http.get<IReportesAlineadosResponse>(
      `${this.basePath.concat(
        environment.endpoints.reportes.numeralia.reportes.alineacion
      )}${anhio}/${cveUsuario}`,
      {
        headers,
      }
    );
  }

  consultaAdecuaciones(anhio: string, cveUsuario: string) {
    const headers = this.getHeaders();
    return this.http.get<IReportesAdecuacionesResponse>(
      `${this.basePath.concat(
        environment.endpoints.reportes.numeralia.reportes.adecuaciones
      )}${anhio}/${cveUsuario}`,
      {
        headers,
      }
    );
  }

  consultaSeguimiento(anhio: string, cveUsuario: string) {
    const headers = this.getHeaders();
    return this.http.get<IReportesSeguimientoResponse>(
      `${this.basePath.concat(
        environment.endpoints.reportes.numeralia.reportes.seguimiento
      )}${anhio}/${cveUsuario}`,
      {
        headers,
      }
    );
  }

  consultaPresupuesto(anhio: string, cveUsuario: string) {
    const headers = this.getHeaders();
    return this.http.get<IReportesPresupuestoResponse>(
      `${this.basePath.concat(
        environment.endpoints.reportes.numeralia.reportes.presupuesto
      )}${anhio}/${cveUsuario}`,
      {
        headers,
      }
    );
  }
}
