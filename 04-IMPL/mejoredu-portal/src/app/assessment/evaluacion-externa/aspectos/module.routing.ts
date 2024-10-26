import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AspectosComponent } from './aspectos.component';

const routes: Routes = [
  {
    path: '',
    component: AspectosComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
