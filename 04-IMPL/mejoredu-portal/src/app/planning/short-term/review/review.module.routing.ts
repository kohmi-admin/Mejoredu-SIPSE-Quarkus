import { RouterModule, Routes } from "@angular/router";
import { ReviewComponent } from "./review.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: ReviewComponent,
  },
  {
    path: 'Validar',
    loadChildren: () => import('./validate/validate.module').then(m => m.ValidateModule)
  },
  {
    path: 'Revisión',
    loadChildren: () => import('./rv/rv.module').then(m => m.RvModule)
  },
  {
    path: 'Revisión Planeación',
    loadChildren: () => import('./rv-plan/rv-plan.module').then(m => m.RvPlanModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewRoutingModule { }
