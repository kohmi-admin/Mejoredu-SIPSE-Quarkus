import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ProyectoPaaComponent } from "./proyecto-paa/proyecto-paa.component";
import { PaaAprobadosComponent } from "./paa-aprobados/paa-aprobados.component";

const routes: Routes = [
    {
        path: '',
        component: ProyectoPaaComponent,
    },
    {
        path: 'Visualizar',
        loadChildren: () => import('./consultation/consultation.module').then(m => m.ConsultationModule),
    },
    {
        path: 'Proyecto PAA',
        component: ProyectoPaaComponent,
    },
    {
        path: 'PAA Aprobados',
        component: PaaAprobadosComponent,
    },
    { path: '', pathMatch: 'full', redirectTo: '' },
    { path: '**', pathMatch: 'full', redirectTo: '' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsultaRoutingModule {

}