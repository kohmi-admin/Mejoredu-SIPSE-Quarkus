import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { DesempenioComponent } from "./desempenio.component";

const routes: Routes = [
    {
        path: '',
        component: DesempenioComponent,
    },
    { path: '**', redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
})
export class RoutingModule { }