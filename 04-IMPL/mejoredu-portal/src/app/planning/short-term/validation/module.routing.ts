import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ValidationComponent } from "./validation.component";

const routes: Routes = [
    {
        path: '',
        component: ValidationComponent,
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