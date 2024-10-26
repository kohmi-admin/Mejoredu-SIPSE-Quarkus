import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { O001Component } from "./o001.component";
import { GeneralDataComponent } from "./general-data/general-data.component";


const routes: Routes = [
    {
        path: '',
        component: O001Component,
        children: [
            {
                path: 'Fichas de Indicadores de Desempeño',
                component: GeneralDataComponent,
            },
            { path: '**', redirectTo: 'Fichas de Indicadores de Desempeño' },
        ]
        // Fichas de Indicadores de Desempeño
    },
    { path: '**', redirectTo: '' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }