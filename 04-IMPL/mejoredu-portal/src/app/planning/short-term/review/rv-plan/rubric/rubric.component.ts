import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IRubricaComponent,
  IRubricaPayload,
} from '@common/interfaces/validation.interface';
import { AlfrescoService } from '@common/services/alfresco.service';
import * as SecureLS from 'secure-ls';

@Component({
  selector: 'app-rubric',
  templateUrl: './rubric.component.html',
  styleUrls: ['./rubric.component.scss'],
})
export class RubricComponent {
  ls = new SecureLS({ encodingType: 'aes' });
  selectedRubric: IRubricaComponent;
  listRubrics: IRubricaPayload[] = [
    {
      idRubro: 1,
      cxObservaciones: null,
      ixPuntuacion: 0,
    },
    {
      idRubro: 2,
      cxObservaciones: null,
      ixPuntuacion: 0,
    },
    {
      idRubro: 3,
      cxObservaciones: null,
      ixPuntuacion: 0,
    },
    {
      idRubro: 4,
      cxObservaciones: null,
      ixPuntuacion: 0,
    },
    {
      idRubro: 5,
      cxObservaciones: null,
      ixPuntuacion: 0,
    },
  ];
  totalRubric: string = '0%';
  redirectToRevision: boolean = false;
  closeRubric: boolean = false;

  constructor(
    private router: Router,
    private alfrescoService: AlfrescoService
  ) {
    this.selectedRubric = this.ls.get('selectedRubric');
    if (!this.selectedRubric) {
      this.redirecToRevision();
    }
  }

  ngOnInit() {
    if (this.selectedRubric) {
      if (this.selectedRubric?.listRubrics?.length) {
        for (let i = 0; i < this.listRubrics.length; i++) {
          const finded = this.selectedRubric.listRubrics.filter(
            (itemFilter) => itemFilter.idRubro === this.listRubrics[i].idRubro
          );
          if (finded?.length > 0) {
            this.listRubrics[i].ixPuntuacion = finded[0].ixPuntuacion;
            this.listRubrics[i].cxObservaciones = finded[0].cxObservaciones;
            const comment = document.getElementById(
              `comment-rubric-${this.listRubrics[i].idRubro - 1}`
            );
            if (comment) {
              comment.innerText = finded[0].cxObservaciones || '';
            }
          }
        }
      }
      this.totalRubric = this.getTotalRubric();
      this.settearLS();
    }
  }

  selectedRubro(pos: number, val: number) {
    if (!this.selectedRubric.disable) {
      this.listRubrics[pos].ixPuntuacion = val;
      this.totalRubric = this.getTotalRubric();
      this.settearLS();
    }
  }

  changeComment(pos: number) {
    const comment = document.getElementById(`comment-rubric-${pos}`);
    this.listRubrics[pos].cxObservaciones = comment?.textContent
      ? comment?.textContent
      : null;
    this.settearLS();
  }

  settearLS() {
    const dataLS: IRubricaComponent = {
      ...this.selectedRubric,
      listRubrics: this.listRubrics,
      totalRubric: this.totalRubric,
    };
    this.ls.set('selectedRubric', dataLS);
  }

  redirecToRevision(): void {
    this.closeRubric = true;
    if (this.selectedRubric.disable) {
      this.router.navigateByUrl(
        '/Planeación/Planeación a Corto Plazo/Formulación/Ajuste de Proyectos/Productos'
      );
    } else {
      this.redirectToRevision = true;
      this.router.navigateByUrl(
        '/Planeación/Planeación a Corto Plazo/Revisión y Validación/Revisión Planeación'
      );
    }
  }

  getTotalRubric(): string {
    const total = this.listRubrics.reduce(
      (acumulador, actual) => acumulador + actual.ixPuntuacion,
      0
    );
    return `${Math.trunc((total * 100) / 15)}%`;
  }

  ngOnDestroy() {
    if (this.closeRubric) {
      if (!this.redirectToRevision) {
        this.ls.remove('selectedValidateProyectoPAA');
        this.ls.remove('selectedRubric');
      }
    } else {
      this.ls.remove('selectedValidateProyectoPAA');
      this.ls.remove('selectedRubric');
      this.ls.remove('selectedAjustesProyectoPAA');
      this.ls.remove('selectedActividad');
      this.ls.remove('selectedProducto');
    }
  }

  downloadFileAlf() {
    if (this.selectedRubric.docAnalitico?.uuid) {
      const uid = this.selectedRubric.docAnalitico?.uuid;
      const fileName = this.selectedRubric.docAnalitico.nombre;
      this.alfrescoService.viewOrDownloadFileAlfService({
        action: 'download',
        uid,
        fileName,
      });
    }
  }
}
