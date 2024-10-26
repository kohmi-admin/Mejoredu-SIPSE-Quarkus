import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteComponent } from './site.component';
import { StartComponent } from './start/start.component';

const routes: Routes = [
  {
    path: '',
    component: SiteComponent,
    children: [
      {
        path: '', data: { title: 'Planning' },
        component: StartComponent
      },
      {
        path: 'Planeación', data: { title: 'Planeación' },
        loadChildren: () => import('../planning/planning.module').then(m => m.PlanningModule)
      },
      {
        path: 'Seguimiento', data: { title: 'Seguimiento' },
        loadChildren: () => import('../follow/follow.module').then(m => m.FollowModule)
      },
      {
        path: 'Evaluación y Mejora Continua', data: { title: 'Evaluación y Mejora Continua' },
        loadChildren: () => import('../assessment/assessment.module').then(m => m.AssessmentModule)
      },
      {
        path: 'Reportes y Numeralia', data: { title: 'Reportes y Numeralia' },
        loadChildren: () => import('../reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'Configuración', data: { title: 'Configuración' },
        loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule)
      },
    ]
  },
  { path: '', pathMatch: 'full', redirectTo: '' },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteRoutingModule { }
