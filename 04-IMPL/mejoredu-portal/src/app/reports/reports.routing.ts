import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { NgModule } from '@angular/core';
import { ChartBoardComponent } from './chart-board/chart-board.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      // {
      //     path: 'Gráficas',
      //     component: ChartBoardComponent
      // },
      // {
      //   path: 'Reportes',
      //   loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
      // },
      // { path: '**', redirectTo: 'Reportes' },
    ],
  },
  {
    path: 'Numeralia',
    loadChildren: () => import('./numeralia/numeralia.module').then(m => m.NumeraliaModule)
  },
  {
    path: 'Extractor de Datos',
    loadChildren: () => import('./extractor/extractor.module').then(m => m.ExtractorModule)
  },
  {
    path: 'Reportes',
    loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
