import { Route, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { PaaComponent } from "./paa.component";

const routes:  Route[] = [
    {
        path: '',
        component: PaaComponent,
        children: [
            {
                path: 'General',
                loadChildren: () => import('./general/general.module').then(m => m.GeneralModule)
            },
            { path: '**', redirectTo: 'General' }
        ]
    },
    { path: '**', redirectTo: '' },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}