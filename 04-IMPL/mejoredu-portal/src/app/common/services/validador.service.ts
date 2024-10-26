import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEpilogoResponsePorIdEstructura } from '@common/interfaces/epilogo.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import {
  IConsultaRevisionResponse,
  IValidationPayload,
} from '@common/interfaces/validation.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ValidadorService {
  constructor(private http: HttpClient) { }

  private hostCP = `${environment.endpoints.planeacion.cortoPlazo.host}`;
  private hostMP = `${environment.endpoints.planeacion.medianoPlazo.host}`;
  private hostPP = `${environment.endpoints.planeacion.presupuestarios.host}`;
  private pathValidadorCP = `${environment.endpoints.planeacion.cortoPlazo.validador.path}`;
  private pathValidadorMP = `${environment.endpoints.planeacion.medianoPlazo.validador.path}`;
  private pathValidadorPP = `${environment.endpoints.planeacion.presupuestarios.validador.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  consultarRevision({
    apartado,
    fromModule,
    idSave,
    tipoUsuario,
    trimestre
  }: {
    apartado: string;
    idSave: string;
    tipoUsuario: string;
    fromModule: 'cp' | 'mp' | 'ap' | 'pp';
    trimestre?: any;
  }) {
    const headers = this.getHeaders();
    let url = '';
    if (fromModule === 'cp') {
      url = `${this.hostCP}${this.pathValidadorCP}${environment.endpoints.planeacion.cortoPlazo.validador.consultarRevision}${apartado}/${idSave}/${tipoUsuario}`;
    } else if (fromModule === 'mp') {
      url = `${this.hostMP}${this.pathValidadorMP}${environment.endpoints.planeacion.medianoPlazo.validador.consultarRevision}${apartado}/${idSave}/${tipoUsuario}`;
    } else if(fromModule === 'ap'){
      url = `${environment.endpoints.seguimiento.seguimientoAnual.avances.hostBase}${environment.endpoints.seguimiento.seguimientoAnual.avances.validacion.consultarRevision}${apartado}/${idSave}/${trimestre}/${tipoUsuario}`;
    } else {
      url = `${this.hostPP}${this.pathValidadorPP}${environment.endpoints.planeacion.presupuestarios.validador.consultarRevision}${apartado}/${idSave}/${tipoUsuario}`;
    }
    return this.http.get<IConsultaRevisionResponse>(`${url}`, {
      headers,
    });
  }

  guardar(data: IValidationPayload, fromModule: 'cp' | 'mp' | 'pp' | 'ap') {
    const headers = this.getHeaders();
    let url = '';
    if (fromModule === 'cp') {
      url = `${this.hostCP}${this.pathValidadorCP}${environment.endpoints.planeacion.cortoPlazo.validador.guardar}`;
    } else if (fromModule === 'mp') {
      url = `${this.hostMP}${this.pathValidadorMP}${environment.endpoints.planeacion.medianoPlazo.validador.guardar}`;
    } else if(fromModule === 'ap'){
      url = `${environment.endpoints.seguimiento.seguimientoAnual.avances.hostBase}${environment.endpoints.seguimiento.seguimientoAnual.avances.validacion.guardar}`;
    } else {
      url = `${this.hostPP}${this.pathValidadorPP}${environment.endpoints.planeacion.presupuestarios.validador.guardar}`;
    }
    return this.http.post<IResponseApi>(`${url}`, data, {
      headers,
    });
  }
}
