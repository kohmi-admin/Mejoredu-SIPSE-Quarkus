import { Component } from '@angular/core';

@Component({
  selector: 'app-avances',
  templateUrl: './avances.component.html',
  styleUrls: ['./avances.component.scss']
})
export class AvancesComponent {
  options: any[] = [
    {
      title: 'Registro de Avances Programáticos',
      icon: 'edit',
      imgIcon: 'Registro',
      enable: true,
      finish: false,
      route: 'Registro de Avances Programáticos',
      description: `Registra mensual y trimestral el Avance de Actividades, documentando el cumplimiento de Metas, Evidencias y Características de Productos.`
    },
    {
      title: 'Revisión Trimestral',
      imgIcon: 'Validacion',
      icon: 'event_upcoming',
      enable: true,
      finish: false,
      route: 'Revisión Trimestral',
      description: `Facilita la revisión de los Avances Programáticos, validando la información capturada. Permite corregir datos y generar resúmenes trimestrales de gestión.`
    },
  ];
}
