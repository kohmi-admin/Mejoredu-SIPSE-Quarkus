import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ConsultationComponent } from "./consultation.component";


const routes: Routes = [
    {
        path: '',
        component: ConsultationComponent,
        loadChildren: () => import('../../annual-project/form/form.module').then(m => m.FormModule),
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}