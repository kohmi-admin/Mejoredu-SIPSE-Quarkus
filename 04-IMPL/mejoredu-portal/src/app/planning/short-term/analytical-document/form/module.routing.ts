import { RouterModule, Routes } from "@angular/router";
import { FormComponent } from "./form.component";
import { NgModule } from "@angular/core";
import { DirtyFormGuard } from "@common/guards/dirty-form-guard";

const router: Routes = [
    {
        path: '',
        component: FormComponent,
        canDeactivate: [DirtyFormGuard]
    },
    { path: '', pathMatch: 'full', redirectTo: '' },
    { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(router)],
    exports: [RouterModule]
})
export class RoutingModule { }