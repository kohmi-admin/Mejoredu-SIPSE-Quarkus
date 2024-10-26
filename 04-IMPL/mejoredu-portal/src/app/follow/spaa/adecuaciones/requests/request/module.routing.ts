import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RequestComponent } from "./request.component";

const routes: Routes = [
    {
        path: '',
        component: RequestComponent,
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule {}