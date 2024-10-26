import { RouterModule, Routes } from "@angular/router";
import { MirPiComponent } from "./mir-pi.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: '',
        component: MirPiComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }