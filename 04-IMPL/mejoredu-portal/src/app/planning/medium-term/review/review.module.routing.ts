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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewRoutingModule { }
