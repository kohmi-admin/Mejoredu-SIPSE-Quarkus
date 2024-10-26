import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ServiceErrorsService } from '@common/services/service-errors.service';

@Injectable()
export class ServicesInterceptor implements HttpInterceptor {
  constructor(private errorService: ServiceErrorsService) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // REVIEW: Aqui poner header para los endpints que requieran token
    return next.handle(request).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            const body: any = event.body;
            if (
              typeof body?.codigo === 'string' &&
              String(body?.codigo) !== '200' &&
              String(body?.codigo) !== '202'
            ) {
              this.errorService.getError(
                event.url ?? '',
                body?.codigo,
                body,
                true
              );
            } else if (
              typeof body?.mensaje === 'object' &&
              String(body?.mensaje?.codigo) !== '200' &&
              String(body?.codigo) !== '202'
            ) {
              this.errorService.getError(
                event.url ?? '',
                body?.mensaje?.codigo,
                body?.mensaje,
                true
              );
            }
          }
          return event;
        },
        error: (err) => {
          this.errorService.getError(
            err.url ?? '',
            err.status,
            err.error,
            false
          );
        },
      })
    );
  }
}
