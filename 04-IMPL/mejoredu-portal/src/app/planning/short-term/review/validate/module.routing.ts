import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ValidateComponent } from "./validate.component";


const routes: Routes = [
    {
        path: '',
        component: ValidateComponent,
        loadChildren: () => import('../../annual-project/form/form.module').then(m => m.FormModule),
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}