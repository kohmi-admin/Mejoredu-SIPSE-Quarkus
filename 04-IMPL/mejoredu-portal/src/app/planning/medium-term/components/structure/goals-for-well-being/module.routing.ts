import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { GoalsForWellBeingComponent } from "./goals-for-well-being.component";


const routes: Routes = [
    {
        path: '',
        component: GoalsForWellBeingComponent,
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}