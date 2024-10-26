import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form.component';
import { NgModule } from '@angular/core';


import { ProjectsComponent } from './v2/projects/projects.component';
import { ActivitiesComponent } from './v2/activities/activities.component';
import { ProductsComponent } from './v2/products/products.component';
import { BudgetsComponent } from './v2/budgets/budgets.component';
import { MirComponent } from './v2/mir/mir.component';
import { GoalsWellBeingComponent } from './v2/goals-well-being/goals-well-being.component';
import { GeneralViewComponent } from './v2/general-view/general-view.component';

const router: Routes = [
  {
    path: '',
    component: FormComponent,
    children: [
      { path: 'Proyectos', component: ProjectsComponent, data: { label: 'Proyectos' } },
      { path: 'Actividades', component: ActivitiesComponent, data: { label: 'Actividades' } },
      { path: 'Productos', component: ProductsComponent, data: { label: 'Productos' } },
      { path: 'Presupuestos', component: BudgetsComponent, data: { label: 'Presupuestos' } },
      { path: 'MIR', component: MirComponent, data: { label: 'MIR' } },
      { path: 'Metas Para el bienestar', component: GoalsWellBeingComponent, data: { label: 'Metas Para el bienestar' } },
      { path: 'Vista general', component: GeneralViewComponent, data: { label: 'Vista General' } },
      { path: '', pathMatch: 'full', redirectTo: 'Proyectos' },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: '' },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(router)],
  exports: [RouterModule],
})
export class RoutingModule { }
