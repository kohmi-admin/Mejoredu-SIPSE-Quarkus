import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanningComponent } from './planning.component';

const routes: Routes = [
  {
    path: '',
    component: PlanningComponent,
  },
  {
    path: 'Planeación a Corto Plazo',
    loadChildren: () => import('./short-term/short-term.module').then(m => m.ShortTermModule)
  },
  {
    path: 'Planeación de Mediano Plazo',
    loadChildren: () => import('./medium-term/medium-term.module').then(m => m.MediumTermModule)
  },
  {
    path: 'Programas Presupuestarios',
    loadChildren: () => import('./budget/budget.module').then(m => m.BudgetModule)
  },
  { path: '', pathMatch: 'full', redirectTo: '' },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningRoutingModule { }
