import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnviarCorreoPayload } from '@common/interfaces/configuration/notificador.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.notificador.host}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  enviarCorreo(data: EnviarCorreoPayload){
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.notificador.cuentas
      )}`,
      data,
      { headers }
    );
  }
}
