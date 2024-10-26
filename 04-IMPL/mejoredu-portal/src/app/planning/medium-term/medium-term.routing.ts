import { RouterModule, Routes } from "@angular/router";
import { MediumTermComponent } from "./medium-term.component";
import { NgModule } from "@angular/core";


const routes: Routes = [
  {
    path: '',
    component: MediumTermComponent,
  },
  {
    path: 'Consulta',
    loadChildren: () => import('./consultation/consultation.module').then(m => m.ConsultationModule)
  },
  {
    path: 'Registro',
    loadChildren: () => import('./registro/registro.module').then(m => m.RegistroModule)
  },
  {
    path: 'Validación',
    loadChildren: () => import('./review/review.module').then(m => m.ReviewModule)
  },
  {
    path: 'Actualización',
    loadChildren: () => import('./update/actualizacion.module').then(m => m.ActualizacionModule)
  },
  {
    path: 'Ajustes',
    loadChildren: () => import('./modify/modify.module').then(m => m.ModifyModule)
  },
  { path: '', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediumTermRoutingModule { }
