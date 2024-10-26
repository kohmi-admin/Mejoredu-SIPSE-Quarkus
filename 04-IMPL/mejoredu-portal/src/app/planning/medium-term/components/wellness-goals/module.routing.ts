import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { WellnessGoalsComponent } from "./wellness-goals.component";


const routes: Routes = [
    {
        path: '',
        component: WellnessGoalsComponent,
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}