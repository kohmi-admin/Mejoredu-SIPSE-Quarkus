import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RolesComponent } from "./roles.component";

const routes: Routes = [
    {
        path: '',
        component: RolesComponent,
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }