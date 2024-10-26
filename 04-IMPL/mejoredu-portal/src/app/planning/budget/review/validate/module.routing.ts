import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ValidateComponent } from "./validate.component";


const routes: Routes = [
    {
        path: 'M001',
        component: ValidateComponent,
        loadChildren: () => import('../../programs/m001/m001.module').then(m => m.M001Module),
    },
    {
        path: 'O001',
        component: ValidateComponent,
        loadChildren: () => import('../../programs/o001/o001.module').then(m => m.O001Module),
    },
    {
        path: 'P016',
        component: ValidateComponent,
        loadChildren: () => import('../../programs/p016/p016.module').then(m => m.P016Module),
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}