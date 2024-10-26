import { RouterModule, Routes } from "@angular/router";
import { SpaaComponent } from "./spaa.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: '',
        component: SpaaComponent,
    },
    {
        path: 'Adecuaciones',
        loadChildren: () => import('./adecuaciones/adecuaciones.module').then(m => m.AdecuacionesModule),
    },
    {
        path: 'Avances Programáticos',
        loadChildren: () => import('./avances/avances.module').then(m => m.AvancesModule),
    },
    {
        path: 'Estatus Programático-Presupuestal',
        loadChildren: () => import('./status-pp/status-pp.module').then(m => m.StatusPpModule),
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule {}