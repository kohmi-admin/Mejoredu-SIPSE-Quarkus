import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class O001Service {

  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.seguimiento.seguimientoAnual.host}${environment.endpoints.seguimiento.seguimientoAnual.seguimientoMIRFID.o001.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  public postActividado001(data) {
    const headers = this.getHeaders();
    const url = environment.endpoints.seguimiento.seguimientoAnual.seguimientoMIRFID.o001.justificacionActividadMir
    return this.http.post(this.basePath + url, data, { headers })
  }

  public postMetao001(data) {
    const headers = this.getHeaders();
    const url = environment.endpoints.seguimiento.seguimientoAnual.seguimientoMIRFID.o001.justificacionMetaMir;
    return this.http.post(this.basePath + url, data, { headers })
  }

  public consulta001(anhio, cveUsuario, semestre): any {
    const headers = this.getHeaders();
    const url = environment.endpoints.seguimiento.seguimientoAnual.seguimientoMIRFID.o001.consultaMir;
    return this.http.get(`${this.basePath}${url}${cveUsuario}/${anhio}/${semestre}`, { headers });
  }

  public consultaTodosO001(anhio, cveUsuario, semestre): any {
    const headers = this.getHeaders();
    const url = environment.endpoints.seguimiento.seguimientoAnual.seguimientoMIRFID.o001.consultaTodos;
    return this.http.get(`${this.basePath}${url}${cveUsuario}/${anhio}/${semestre}`, { headers });
  }
}
