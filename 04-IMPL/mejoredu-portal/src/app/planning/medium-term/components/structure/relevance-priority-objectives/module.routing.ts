import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RelevancePriorityObjectivesComponent } from "./relevance-priority-objectives.component";


const routes: Routes = [
    {
        path: '',
        component: RelevancePriorityObjectivesComponent,
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}