import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { DirectionComponent } from "./direction.component";

const routes: Routes = [
    {
        path: '',
        component: DirectionComponent,
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }