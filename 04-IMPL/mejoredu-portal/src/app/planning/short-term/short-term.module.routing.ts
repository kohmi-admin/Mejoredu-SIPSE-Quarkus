import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShortTermComponent } from './short-term.component';
import { FormulationComponent } from './formulation/formulation.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: ShortTermComponent,
  // },
  {
    path: '',
    component: ShortTermComponent,
  },
  {
    path: 'Formulación',
    component: FormulationComponent,
  },
  {
    path: 'Consulta',
    loadChildren: () => import('./consulta/consulta.module').then(m => m.ConsultaModule)
  },
  {
    path: 'Ajustes',
    loadChildren: () => import('./modify/modify.module').then(m => m.ModifyModule)
  },
  {
    path: 'Revisión y Validación',
    loadChildren: () => import('./review/review.module').then(m => m.ReviewModule)
  },
  //
  {
    path: 'Formulación/Carga de Proyectos',
    loadChildren: () => import('./annual-project/upload-file/upload-file.module').then(m => m.UploadFileModule)
  },
  {
    path: 'Formulación/Registro de Proyectos',
    loadChildren: () => import('./formulation/registro/registro.module').then(m => m.RegistroModule)
  },
  {
    path: 'Formulación/Ajuste de Proyectos',
    loadChildren: () => import('./formulation/registro/registro.module').then(m => m.RegistroModule)
  },
  //
  {
    path: 'Formulación/Documento Analítico',
    loadChildren: () => import('./analytical-document/analytical-document.module').then(m => m.AnalyticalDocumentModule)
  },
  {
    path: 'Formulación/Proyecto Anual',
    loadChildren: () => import('./annual-project/form/form.module').then(m => m.FormModule)
  },
  {
    path: 'Formulación/Metas MIR|FID',
    loadChildren: () => import('./mir-fid/mir-fid.module').then(m => m.MirFidModule)
  },
  {
    path: 'Formulación/Proyecto PAA',
    loadChildren: () => import('./paa-project/paa-project.module').then(m => m.PaaProjectModule)
  },
  { path: '', pathMatch: 'full', redirectTo: '' },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShortTermRoutingModule { }
