import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ObjetiveTreeComponent } from "./objetive-tree.component";


const routes: Routes = [
    {
        path: '',
        component: ObjetiveTreeComponent,
    },
    { path: '**', redirectTo: '' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }