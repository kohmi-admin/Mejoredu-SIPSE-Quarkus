import { RouterModule, Routes } from "@angular/router";
import { PaaProjectComponent } from "./paa-project.component";
import { NgModule } from "@angular/core";


const routes: Routes = [
    {
        path: '',
        component: PaaProjectComponent,
    },
    {
        path: 'PAA Formulado',
        loadChildren: () => import('./paa-form/paa-form.module').then(m => m.PaaFormModule),
    },
    { path: '', pathMatch: 'full', redirectTo: '' },
    { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }