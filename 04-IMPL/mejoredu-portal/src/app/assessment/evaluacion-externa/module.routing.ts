import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EvaluacionExternaComponent } from './evaluacion-externa.component';

const routes: Routes = [
  {
    path: '',
    component: EvaluacionExternaComponent,
    children: [
      {
        path: 'Informes',
        loadChildren: () =>
          import('./informes/informes.module').then((m) => m.InformesModule),
      },
      {
        path: 'Aspectos Susceptibles de Mejora',
        loadChildren: () =>
        import('./aspectos/aspectos.module').then((m) => m.AspectosModule),
      },
      { path: '', redirectTo: 'Informes', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
