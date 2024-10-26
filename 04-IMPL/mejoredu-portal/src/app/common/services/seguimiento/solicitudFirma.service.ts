import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IConsultarSolicitudFirmaResponse,
  IRegistrarSolicitudFirmaPayload,
  IRegistrarSolicitudFirmaResponse,
} from '@common/interfaces/seguimiento/solicitudFirma.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SolicitudFirmaService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.seguimiento.seguimientoAnual.host}${environment.endpoints.seguimiento.seguimientoAnual.solicitudFirma.path}`;
  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  registrarFirma(data: IRegistrarSolicitudFirmaPayload) {
    const headers = this.getHeaders();
    return this.http.post<IRegistrarSolicitudFirmaResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.solicitudFirma
          .registrar
      )}`,
      data,
      { headers }
    );
  }

  consultarFirma(idFirma: number) {
    const headers = this.getHeaders();
    return this.http.get<IConsultarSolicitudFirmaResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.solicitudFirma
          .consultaPorId
      )}${idFirma}`,
      { headers }
    );
  }
}
