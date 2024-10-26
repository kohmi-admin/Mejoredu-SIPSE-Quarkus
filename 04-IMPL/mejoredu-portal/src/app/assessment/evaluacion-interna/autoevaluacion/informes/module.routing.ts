import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { InformesComponent } from "./informes.component";

const routes: Routes = [
    {
        path: '',
        component: InformesComponent,
    },
    { path: '**', redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
})
export class RoutingModule { }