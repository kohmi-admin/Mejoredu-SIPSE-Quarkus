import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AssessmentComponent } from "./assessment.component";

const routes: Routes = [
    {
        path: '',
        component: AssessmentComponent,
    },
    {
        path: 'Evaluación Interna',
        loadChildren: () => import('./evaluacion-interna/evaluacion-interna.module').then(m => m.EvaluacionInternaModule)
    },
    {
        path: 'Evaluación Externa',
        loadChildren: () => import('./evaluacion-externa/evaluacion-externa.module').then(m => m.EvaluacionExternaModule)
    },
    {
        path: 'Encuestas y Consultas',
        loadChildren: () => import('./encuestas-consultas/encuestas-consultas.module').then(m => m.EncuestasConsultasModule)
    },
    { path: '**', redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
})
export class AssessmentRoutingModule { }