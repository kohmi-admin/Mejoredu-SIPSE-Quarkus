import { RouterModule, Routes } from "@angular/router";
import { WorkSpaceComponent } from "./work-space.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: '',
        component: WorkSpaceComponent,
    },
    { path: '', pathMatch: 'full', redirectTo: '' },
    { path: '**', pathMatch: 'full', redirectTo: '' },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }