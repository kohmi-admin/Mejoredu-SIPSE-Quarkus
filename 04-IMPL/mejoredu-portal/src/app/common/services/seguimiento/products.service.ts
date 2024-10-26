import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGetParamsByIdProyectoResponse } from '@common/interfaces/medium-term/params.interface';
import {
  IProductPayload,
  IProductoSecuencialResponse,
  IProductsResponse,
} from '@common/interfaces/products.interface';
import { IResponseApi } from '@common/interfaces/response-api.interface';
import {
  ICreateProductResponse,
  IGetProdModByIdAdecuacionResponse,
} from '@common/interfaces/seguimiento/products.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) { }

  private basePath = `${environment.endpoints.seguimiento.seguimientoAnual.host}${environment.endpoints.seguimiento.seguimientoAnual.productos.path}`;

  private getHeaders() {
    return new HttpHeaders({
      // authorization: 'Basic ' + btoa('usr_alf_mejored:usr_alf_mejored'),
    });
  }

  createProduct(data: IProductPayload) {
    const headers = this.getHeaders();
    return this.http.post<ICreateProductResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.productos.registrar
      )}`,
      data,
      { headers }
    );
  }

  updateProduct(idProducto: string, data: IProductPayload) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.productos.modificar
      )}${idProducto}`,
      data,
      { headers }
    );
  }

  getProductById(idProduct: number) {
    const headers = this.getHeaders();
    return this.http.get<any>( //FIX: IProductsResponse
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.productos
          .consultarPorId
      )}${idProduct}`,
      {
        headers,
      }
    );
  }

  getProdModiByIdAdecuacionSolicitud(idAdecuaciónSolicitud: number) {
    const headers = this.getHeaders();
    return this.http.get<IGetProdModByIdAdecuacionResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.productos
          .consultaProductoModificacion
      )}${idAdecuaciónSolicitud}`,
      {
        headers,
      }
    );
  }

  getProductCancelation(idAdecuaciónSolicitud: number) {
    const headers = this.getHeaders();
    return this.http.get<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.productos
          .consultaProductoCancelacion
      )}${idAdecuaciónSolicitud}`,
      {
        headers,
      }
    );
  }

  getProductByActivityId(idActivity: string) {
    const headers = this.getHeaders();
    return this.http.get<IProductsResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.productos
          .consultaPorActividad
      )}${idActivity}`,
      {
        headers,
      }
    );
  }

  getProductByActivityIdSolicitud(
    idActividad: string,
    excluirCortoPlazo: boolean,
    idSolicitud: number
  ) {
    const params = `excluirCortoPlazo=${String(
      excluirCortoPlazo
    )}&idActividad=${idActividad}&idSolicitud=${idSolicitud}`;
    const headers = this.getHeaders();
    return this.http.get<IProductsResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.productos
          .consultaPorActividadSolicitud
      )}?${params}`,
      {
        headers,
      }
    );
  }

  deleteProduct(idProducto: string) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.productos.eliminar
      )}${idProducto}`,
      {},
      { headers }
    );
  }

  getSecuencialPorProyecto(idProyecto: number) {
    const headers = this.getHeaders();
    return this.http.get<IProductoSecuencialResponse>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.productos
          .secuencialPorProyecto
      )}${idProyecto}`,
      {
        headers,
      }
    );
  }

  cancelProduct(data: {
    idAdecuacionSolicitud: number;
    idProductoReferencia: number;
  }) {
    const headers = this.getHeaders();
    return this.http.put<IResponseApi>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.productos
          .cancelarProducto
      )}`,
      data,
      { headers }
    );
  }

  getParamsByIdProyecto(idProyecto: number) {
    const headers = this.getHeaders();
    return this.http.get<IGetParamsByIdProyectoResponse>(
      `${environment.endpoints.seguimiento.seguimientoAnual.host.concat(
        environment.endpoints.seguimiento.seguimientoAnual.parametroConsultaByIdProyecto
      )}${idProyecto}`,
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
    return this.http.put<any>(
      `${this.basePath.concat(
        environment.endpoints.seguimiento.seguimientoAnual.productos
          .eliminarAdecuacion
      )}`,
      data,
      { headers }
    );
  }
}
