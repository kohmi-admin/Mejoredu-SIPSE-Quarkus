import { RouterModule, Routes } from "@angular/router";
import { RvPlanComponent } from "./rv-plan.component";
import { NgModule } from "@angular/core";
import { RubricComponent } from "./rubric/rubric.component";

const routes: Routes = [
    {
        path: '',
        component: RvPlanComponent,
    },
    {
        path: 'Rúbrica',
        component: RubricComponent,
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RvPlanRoutingModule { }