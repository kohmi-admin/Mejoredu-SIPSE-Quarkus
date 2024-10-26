import { RouterModule, Routes } from "@angular/router";
import { PaaFormComponent } from "./paa-form.component";
import { NgModule } from "@angular/core";


const routes: Routes = [
    {
        path: '',
        component: PaaFormComponent,
    },
    { path: '', pathMatch: 'full', redirectTo: '' },
    { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }