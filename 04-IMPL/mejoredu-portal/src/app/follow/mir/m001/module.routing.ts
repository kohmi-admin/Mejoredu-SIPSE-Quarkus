import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { M001Component } from "./m001.component";

const routes: Routes = [
    {
        path: '',
        component: M001Component,
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }