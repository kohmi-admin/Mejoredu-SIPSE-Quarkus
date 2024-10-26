import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { MatrixComponent } from "./matrix.component";


const routes: Routes = [
    {
        path: '',
        component: MatrixComponent,
    },
    { path: '**', redirectTo: '' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }