import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { StatusPpComponent } from "./status-pp.component";

const routes: Routes = [
    {
        path: '',
        component: StatusPpComponent,
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule {}