import { Route, RouterModule } from "@angular/router";
import { ReportsComponent } from "./reports.component";
import { NgModule } from "@angular/core";

const routes:  Route[] = [
    {
        path: '',
        component: ReportsComponent,
        children: [
            {
                path: 'PAA',
                loadChildren: () => import('./paa/paa.module').then(m => m.PaaModule)
            },
            {
                path: 'Alineación MIR|PI',
                loadChildren: () => import('./mir-pi/mir-pi.module').then(m => m.MirPiModule)
            },
            {
                path: 'Adecuaciones Programáticas',
                loadChildren: () => import('./adecuaciones/adecuaciones.module').then(m => m.AdecuacionesModule)
            },
            {
                path: 'Seguimiento',
                loadChildren: () => import('./seguimiento/seguimiento.module').then(m => m.SeguimientoModule)
            },
            {
                path: 'Presupuesto',
                loadChildren: () => import('./presupuesto/presupuesto.module').then(m => m.PresupuestoModule)
            },
            { path: '**', redirectTo: 'PAA' },
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportsRoutingModule {}