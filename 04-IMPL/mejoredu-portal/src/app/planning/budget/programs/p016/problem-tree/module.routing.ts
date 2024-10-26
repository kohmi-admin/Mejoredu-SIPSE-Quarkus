import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ProblemTreeComponent } from "./problem-tree.component";


const routes: Routes = [
    {
        path: '',
        component: ProblemTreeComponent,
    },
    { path: '**', redirectTo: '' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }