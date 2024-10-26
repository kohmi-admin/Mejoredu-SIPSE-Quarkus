import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RequestsComponent } from "./requests.component";

const routes: Routes = [
  {
    path: '',
    component: RequestsComponent,
  },
  {
    path: 'Nueva',
    loadChildren: () => import('./request/request.module').then(m => m.RequestModule),
  },
  {
    path: 'Editar',
    loadChildren: () => import('./request/request.module').then(m => m.RequestModule),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
