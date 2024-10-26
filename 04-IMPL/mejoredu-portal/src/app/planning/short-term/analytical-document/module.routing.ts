import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticalDocumentComponent } from './analytical-document.component';

const routes: Routes = [
  {
    path: '',
    component: AnalyticalDocumentComponent
  },
  {
    path: 'Cargar Archivo',
    loadChildren: () => import('./upload-file/upload-file.module').then(m => m.UploadFileModule)
  },
  {
    path: 'Formulario',
    loadChildren: () => import('./form/form.module').then(m => m.FormModule)
  },
  {
    path: 'Espacio de Trabajo',
    loadChildren: () => import('./work-space/work-space.module').then(m => m.WorkSpaceModule)
  },
  { path: '', pathMatch: 'full', redirectTo: '' },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
