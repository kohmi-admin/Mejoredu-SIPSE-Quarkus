import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ParamsComponent } from "./params.component";


const routes: Routes = [
    {
        path: '',
        component: ParamsComponent,
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}