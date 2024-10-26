import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { PeriodComponent } from "./period.component";

const routes: Routes = [
    {
        path: '',
        component: PeriodComponent,
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }