import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ModifyComponent } from "./modify.component";

const routes: Routes = [
    {
        path: '',
        component: ModifyComponent,
    },
    { path: '', pathMatch: 'full', redirectTo: '' },
    { path: '**', pathMatch: 'full', redirectTo: '' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule {

}