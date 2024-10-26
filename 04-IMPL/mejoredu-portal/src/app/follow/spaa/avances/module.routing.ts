import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AvancesComponent } from "./avances.component";

const routes: Routes = [
    {
        path: '',
        component: AvancesComponent,
    },
    {
        path: 'Revisión Trimestral',
        loadChildren: () => import('./revision/revision.module').then(m => m.RevisionModule)
    },
    {
        path: 'Registro de Avances Programáticos',
        loadChildren: () => import('./registro/registro.module').then(m => m.RegistroModule)
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule {}