import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { O001Component } from "./o001.component";

const routes: Routes = [
    {
        path: '',
        component: O001Component,
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }