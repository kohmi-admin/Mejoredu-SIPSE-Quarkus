import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { SpecificActionsComponent } from "./specific-actions.component";


const routes: Routes = [
    {
        path: '',
        component: SpecificActionsComponent,
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}