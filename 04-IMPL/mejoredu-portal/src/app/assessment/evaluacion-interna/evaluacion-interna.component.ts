import { Component } from '@angular/core';

@Component({
  selector: 'app-evaluacion-interna',
  templateUrl: './evaluacion-interna.component.html',
  styleUrls: ['./evaluacion-interna.component.scss']
})
export class EvaluacionInternaComponent {
  options: any[] = [
    {
      title: 'Informe de Autoevaluacion',
      icon: 'attach_file',
      imgIcon: 'InformeAutoevaluacion',
      enable: true,
      finish: false,
      route: 'Informe de Autoevaluacion',
      description: `Recopila y presenta los avances en el logro de las Metas Anuales en correspondencia con las atribuciones de la Comisión y la Gestión Institucional.`
    },
    {
      title: 'Evaluación Interna del Desempeño',
      icon: 'equalizer',
      imgIcon: 'EvaluacionInternaDesempeno',
      enable: true,
      finish: false,
      route: 'Evaluación Interna del Desempeño',
      description: `Repositorio de Evaluaciones Internas realizadas para medir el rendimiento de la Institución de los procesos y Actividades, identificando áreas de fortaleza y oportunidades de Mejora Continua.`
    },
  ];
}
