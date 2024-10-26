import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { M001Component } from "./m001.component";
import { GeneralDataComponent } from "./general-data/general-data.component";


const routes: Routes = [
    {
        path: '',
        component: M001Component,
        children: [
            {
                path: 'Fichas de Indicadores de Desempeño',
                component: GeneralDataComponent,
            },
            { path: '**', redirectTo: 'Fichas de Indicadores de Desempeño' },
        ]
    },
    {
        path: 'Datos Generales',
        component: GeneralDataComponent
    },
    { path: '**', redirectTo: '' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }