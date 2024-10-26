import { RouterModule, Routes } from "@angular/router";
import { AutoevaluacionComponent } from "./autoevaluacion.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: '',
        component: AutoevaluacionComponent,
        children: [
            {
                path: 'Informes',
                loadChildren: () => import('./informes/informes.module').then(m => m.InformesModule)
            },
            {
                path: 'Carga de Evidencia',
                loadChildren: () => import('./carga/carga.module').then(m => m.CargaModule)
            },
            { path: '', redirectTo: 'Informes', pathMatch: 'full' },
        ],
    },
    { path: '**', redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
})
export class AutoevaluacionRoutingModule { }