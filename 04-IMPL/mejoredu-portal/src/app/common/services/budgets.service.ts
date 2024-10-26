import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBudgetPayload, IBudgetResponse } from '@common/interfaces/short-term/budget.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BudgetsService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.planeacion.cortoPlazo.host}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createBudget(data: any) {
    const headers = this.getHeaders();
    return this.http.post<IBudgetPayload>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.presupuestos.registrar
      )}`,
      data,
      { headers }
    );
  }

  getBudgetByIdProduct(idProduct: number) {
    const headers = this.getHeaders();
    return this.http.get<IBudgetResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.presupuestos
          .consultaPorProducto
      )}${idProduct}`,
      {
        headers,
      }
    );
  }

  updateBudget(idBudget: any, data: any) {
    const headers = this.getHeaders();
    return this.http.put<IBudgetResponse>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.presupuestos.modificar
      )}${idBudget}`,
      data,
      { headers }
    );
  }

  deleteBudget(idBudget: number) {
    const headers = this.getHeaders();
    return this.http.put<any>(
      `${this.basePath.concat(
        environment.endpoints.planeacion.cortoPlazo.presupuestos.eliminar
      )}${idBudget}`,
      { headers }
    );
  }
}
