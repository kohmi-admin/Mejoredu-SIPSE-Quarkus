import { RouterModule, Routes } from "@angular/router";
import { GeneralComponent } from "./general.component";
import { NgModule } from "@angular/core";


const routes: Routes = [
    {
        path: '',
        component: GeneralComponent,
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }