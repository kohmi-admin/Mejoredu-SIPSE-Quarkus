import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { SmpComponent } from "./smp.component";

const routes: Routes = [
    {
        path: '',
        component: SmpComponent,
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule {}