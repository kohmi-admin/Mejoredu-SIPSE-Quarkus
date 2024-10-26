import { RouterModule, Routes } from "@angular/router";
import { ConsultingComponent } from "./consulting.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: '',
        component: ConsultingComponent,
    },
    {
        path: '',
        loadChildren: () => import('./view/view.module').then(m => m.ViewModule)
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsultingRoutingmoodule { }