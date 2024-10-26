import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { P016Component } from "./p016.component";


const routes: Routes = [
    {
        path: '',
        component: P016Component,
        children: [
            {
                path: 'Datos Generales',
                loadChildren: () => import('./general-data/general-data.module').then(m => m.GeneralDataModule)
            },
            {
                path: 'Diagnóstico',
                loadChildren: () => import('./diagnostic/diagnostic.module').then(m => m.DiagnosticModule)
            },
            {
                path: 'Árbol del Problema',
                loadChildren: () => import('./problem-tree/problem-tree.module').then(m => m.ProblemTreeModule)
            },
            {
                path: 'Árbol de Objetivos',
                loadChildren: () => import('./objetive-tree/objetive-tree.module').then(m => m.ObjetiveTreeModule)
            },
            {
                path: 'Matríz de Indicadores para Resultados',
                loadChildren: () => import('./matrix/matrix.module').then(m => m.MatrixModule)
            },
            { path: '**', redirectTo: 'Datos Generales' }
        ]
    },
    { path: '**', redirectTo: '' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }