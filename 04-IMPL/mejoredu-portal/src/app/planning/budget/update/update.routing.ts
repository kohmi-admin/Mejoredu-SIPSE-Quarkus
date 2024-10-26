import { RouterModule, Routes } from "@angular/router";
import { UpdateComponent } from "./update.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: '',
        component: UpdateComponent,
    },
    {
        path: '',
        loadChildren: () => import('./modify/modify.module').then(m => m.ModifyModule)
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UpdateRoutingmoodule { }