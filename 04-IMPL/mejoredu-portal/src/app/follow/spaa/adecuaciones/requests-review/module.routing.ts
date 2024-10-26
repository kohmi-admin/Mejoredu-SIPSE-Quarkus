import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RequestsReviewComponent } from "./requests-review.component";

const routes: Routes = [
    {
        path: '',
        component: RequestsReviewComponent,
    },
    {
        path: 'Estado',
        loadChildren: () => import('./status/status.module').then(m => m.StatusModule),
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule {}