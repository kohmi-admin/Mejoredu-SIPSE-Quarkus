import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AdecuacionesComponent } from "./adecuaciones.component";

const routes: Routes = [
    {
        path: '',
        component: AdecuacionesComponent,
    },
    {
        path: 'Solicitudes',
        loadChildren: () => import('./requests/requests.module').then(m => m.RequestsModule),
    },
    {
        path: 'Revisión de Solicitudes',
        loadChildren: () => import('./requests-review/requests-review.module').then(m => m.RequestsReviewModule),
    
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule {}