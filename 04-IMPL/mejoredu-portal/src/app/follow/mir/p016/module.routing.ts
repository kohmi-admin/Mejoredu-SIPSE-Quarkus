import { RouterModule, Routes } from "@angular/router";
import { P016Component } from "./p016.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: '',
        component: P016Component,
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }