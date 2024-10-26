import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { DiagnosticComponent } from "./diagnostic.component";


const routes: Routes = [
    {
        path: '',
        component: DiagnosticComponent,
    },
    { path: '**', redirectTo: '' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }