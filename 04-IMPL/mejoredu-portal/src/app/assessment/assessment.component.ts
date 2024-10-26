import { Component } from '@angular/core';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent {
  options: any[] = [
    {
      title: 'Evaluación Interna',
      icon: 'task',
      imgIcon: 'EvaluacionInterna',
      enable: true,
      finish: false,
      route: 'Evaluación Interna',
      description: `Este submódulo integra los registros de los Informes de Autoevaluación, así como el repositorio de Evaluaciones Internas.`
    },
    {
      title: 'Evaluación Externa',
      icon: 'rate_review',
      imgIcon: 'EvaluacionExterna',
      enable: true,
      finish: false,
      route: 'Evaluación Externa',
      description: `Este submódulo integra un repositorio de Evaluaciones realizadas a los Programas Presupuestarios.`
    },
    {
      title: 'Encuestas y Consultas',
      icon: 'comment',
      imgIcon: 'EncuestasConsultas',
      enable: true,
      finish: false,
      route: 'Encuestas y Consultas',
      description: `Este submódulo integra un repositorio de los informes de resultados de Encuestas y Consultas realizadas por MEJOREDU.`
    }
  ];
}
