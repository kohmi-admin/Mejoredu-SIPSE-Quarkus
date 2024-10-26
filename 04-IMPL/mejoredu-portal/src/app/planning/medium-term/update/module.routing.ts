import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ActualizacionComponent } from "./actualizacion.component";


const routes: Routes = [
  {
    path: '',
    component: ActualizacionComponent,
    loadChildren: () => import('../components/structure/structure.module').then(m => m.StructureModule),
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule { }
