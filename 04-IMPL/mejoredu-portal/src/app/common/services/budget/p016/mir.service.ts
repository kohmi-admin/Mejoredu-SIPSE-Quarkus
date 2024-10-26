import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IIndicador,
  IIndicatorResponse,
  IP016MIRResponse,
  IRegisterMIR,
} from '@common/interfaces/budget/p016/mir.interface';
import { ICatalogResponse } from '@common/interfaces/catalog.interface';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class P016MirService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.presupuestarios.host}${environment.endpoints.planeacion.presupuestarios.mir.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  getMirPorAnhio(year: string) {
    const headers = this.getHeaders();
    return this.http.get<IP016MIRResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.mir.consultaPorAnhio
      )}${year}`,
      {
        headers,
      }
    );
  }

  registerMirPorAnhio(data: IRegisterMIR) {
    const headers = this.getHeaders();
    return this.http.post<IP016MIRResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.presupuestarios.mir.registrar
      )}`,
      data,
      {
        headers,
      }
    );
  }

  consultarFicha(idIndicador: number) {
    const headers = this.getHeaders();
    return this.http.get<IIndicatorResponse>(
      `${this.basePath.concat(
        '/' + idIndicador + environment.endpoints.planeacion.presupuestarios.mir.consultarFicha
      )}`,
      {
        headers,
      }
    );
  }

  registrarFicha(idIndicador: number, data: IIndicador) {
    const headers = this.getHeaders();
    return this.http.post<IP016MIRResponse>(
      `${this.basePath.concat(
        '/' + idIndicador + environment.endpoints.planeacion.presupuestarios.mir.registrarFicha
      )}`,
      data,
      {
        headers,
      }
    );
  }

  async getCatalogMir(year: string) {
    const headers = this.getHeaders();
    return await lastValueFrom(
      this.http.get<ICatalogResponse>(
        `${this.basePath}${environment.endpoints.planeacion.presupuestarios.mir.consultarCatalogoIndicadores}${year}`,
        {
          headers,
        }
      )
    );
  }
}
