import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { EvaluacionInternaComponent } from "./evaluacion-interna.component";

const routes: Routes = [
    {
        path: '',
        component: EvaluacionInternaComponent,
    },
    {
        path: 'Informe de Autoevaluacion',
        loadChildren: () => import('./autoevaluacion/autoevaluacion.module').then(m => m.AutoevaluacionModule)
    },
    {
        path: 'Evaluación Interna del Desempeño',
        loadChildren: () => import('./desempenio/desempenio.module').then(m => m.DesempenioModule),
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
})
export class EvaluacionInternaRoutingModule { }