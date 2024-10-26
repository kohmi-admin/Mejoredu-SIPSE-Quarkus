import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { PresupuestoComponent } from "./presupuesto.component";

const routes: Routes = [
    {
        path: '',
        component: PresupuestoComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }