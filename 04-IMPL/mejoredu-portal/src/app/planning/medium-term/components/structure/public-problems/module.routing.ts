import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { PublicProblemsComponent } from "./public-problems.component";


const routes: Routes = [
    {
        path: '',
        component: PublicProblemsComponent,
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}