import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { SeguimientoComponent } from "./seguimiento.component";

const routes: Routes = [
    {
        path: '',
        component: SeguimientoComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }