import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { UnidadesComponent } from "./unidades.component";

const routes: Routes = [
    {
        path: '',
        component: UnidadesComponent,
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }