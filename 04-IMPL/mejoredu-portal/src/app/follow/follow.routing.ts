import { RouterModule, Routes } from "@angular/router";
import { FollowComponent } from "./follow.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: '',
        component: FollowComponent,
    },
    {
        path: 'Seguimiento del Programa Anual de Actividades',
        loadChildren: () => import('./spaa/spaa.module').then(m => m.SpaaModule)
    },
    {
        path: 'Seguimiento MIR|FID',
        loadChildren: () => import('./mir/mir.module').then(m => m.MirModule)
    },
    {
        path: 'Seguimiento al Mediano Plazo',
        loadChildren: () => import('./smp/smp.module').then(m => m.SmpModule)
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FollowRoutingModule { }