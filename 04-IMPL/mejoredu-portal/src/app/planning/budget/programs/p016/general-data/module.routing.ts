import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { GeneralDataComponent } from "./general-data.component";


const routes: Routes = [
    {
        path: '',
        component: GeneralDataComponent,
    },
    { path: '**', redirectTo: '' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }