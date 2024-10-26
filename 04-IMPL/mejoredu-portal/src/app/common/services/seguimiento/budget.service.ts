import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import { IBudgetPayload, IBudgetResponse, IGetBudgetModByIdAdecuacionResponse } from '@common/interfaces/short-term/budget.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BudgetsFollowService {

  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.seguimiento.seguimientoAnual.host}${environment.endpoints.seguimiento.seguimientoAnual.presupuestos.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createBudget(data: any) {
    const headers = this.getHeaders();
    return this.http.post<IBudgetPayload>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.presupuestos.registrar
      )}`,
      data,
      { headers }
    );
  }

  getBudgetByIdProduct(idProduct: number, excluirCortoPlazo: boolean, idSolicitud: number) {
    const params = `excluirCortoPlazo=${excluirCortoPlazo}&idProducto=${idProduct}&idSolicitud=${idSolicitud}`
    const headers = this.getHeaders();
    return this.http.get<IBudgetResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.presupuestos.consultarPresupuestos
      )}${params}`,
      {
        headers,
      }
    );
  }

  updateBudget(idBudget: any, data: any) {
    const headers = this.getHeaders();
    return this.http.put<IBudgetResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.presupuestos.modificar
      )}${idBudget}`,
      data,
      { headers }
    );
  }

  deleteBudget(idBudget: number) {
    const headers = this.getHeaders();
    return this.http.put<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.presupuestos.eliminar
      )}${idBudget}`,
      { headers }
    );
  }

  cancelBudget(data: {
    idAdecuacionSolicitud: number;
    idPresupuestoReferencia: number;
  }) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.presupuestos.cancelar
      )}`,
      data,
      { headers }
    );
  }

  ampliacionReduccionBudget(data: any) {
    const headers = this.getHeaders();
    return this.http.post<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.presupuestos.registrarAjuste
      )}`,
      data,
      { headers }
    );
  }

  getBudgetModiByIdAdecuacionSolicitud(idAdecuacionSolicitud: number) {
    const headers = this.getHeaders();
    return this.http.get<IGetBudgetModByIdAdecuacionResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.presupuestos
          .consultarPresupuestoModificacion
      )}${idAdecuacionSolicitud}`,
      {
        headers,
      }
    );
  }

  getBudgetCancelacion(idAdecuacionSolicitud: number) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.presupuestos
          .consultarPresupuestoCancelacion
      )}${idAdecuacionSolicitud}`,
      {
        headers,
      }
    );
  }

  getPartidasGastoAjuste(idPresupuesto: number, idAdecuacionSolicitud: number) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.presupuestos
          .consultarAjustes
      )}${idPresupuesto}/${idAdecuacionSolicitud}`,
      {
        headers,
      }
    );
  }

  deleteAdecuacion(data: {
    idReferencia: number;
    idAdecuacionSolicitud: number;
  }) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.presupuestos
          .eliminarAdecuacion
      )}`,
      data,
      { headers }
    );
  }
}
