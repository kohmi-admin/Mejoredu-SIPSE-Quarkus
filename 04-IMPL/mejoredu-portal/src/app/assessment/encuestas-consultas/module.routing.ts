import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EncuestasConsultasComponent } from './encuestas-consultas.component';

const routes: Routes = [
  {
    path: '',
    component: EncuestasConsultasComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
