import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RevisionComponent } from "./revision.component";

const routes: Routes = [
    {
        path: '',
        component: RevisionComponent,
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule {}