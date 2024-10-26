import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AdecuacionesComponent } from "./adecuaciones.component";

const routes: Routes = [
    {
        path: '',
        component: AdecuacionesComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }