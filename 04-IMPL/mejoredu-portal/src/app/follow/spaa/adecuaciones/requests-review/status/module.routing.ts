import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { StatusComponent } from "./status.component";

const routes: Routes = [
    {
        path: '',
        component: StatusComponent,
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule {}