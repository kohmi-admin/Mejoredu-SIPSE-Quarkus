import { Component } from '@angular/core';
import { IItemP016MIRMatriz } from '@common/interfaces/budget/p016/mir.interface';
import { IDatosUsuario } from '@common/interfaces/login.interface';
import { P016MirService } from '@common/services/budget/p016/mir.service';
import { Subject, takeUntil } from 'rxjs';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-view-mir',
  templateUrl: './view-mir.component.html',
  styleUrls: ['./view-mir.component.scss'],
})
export class ViewMirComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  notifier = new Subject();
  table: IItemP016MIRMatriz[] = [];
  yearNav: string = '';
  dataUser: IDatosUsuario;

  constructor(private p016MirService: P016MirService) {
    this.yearNav = this.ls.get('yearNav');
    this.dataUser = this.ls.get('dUaStEaR');
    this.getMirPorAnhio();
  }

  getMirPorAnhio() {
    this.p016MirService
      .getMirPorAnhio(this.yearNav)
      .pipe(takeUntil(this.notifier))
      .subscribe({
        next: (value) => {
          if (value.codigo === '200') {
            const matriz = value.respuesta.matriz;
            this.table = matriz.sort((a, b) => {
              const order = ['Fin', 'Propósito', 'Componente', 'Actividad'];
              return order.indexOf(a.nivel) - order.indexOf(b.nivel);
            });
            setTimeout(() => {
              const $textareas = document.querySelectorAll('textarea');
              $textareas.forEach((item) => {
                item.style.minHeight = item.scrollHeight + 0 + 'px';
              });
            }, 100);
          }
        },
      });
  }
}
