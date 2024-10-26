import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CargaComponent } from "./carga.component";

const routes: Routes = [
    {
        path: '',
        component: CargaComponent,
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
})
export class RoutingModule { }