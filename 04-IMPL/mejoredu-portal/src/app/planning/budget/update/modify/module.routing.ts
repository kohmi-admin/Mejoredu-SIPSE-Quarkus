import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ModifyComponent } from "./modify.component";


const routes: Routes = [
    {
        path: 'M001',
        component: ModifyComponent,
        loadChildren: () => import('../../programs/m001/m001.module').then(m => m.M001Module),
    },
    {
        path: 'O001',
        component: ModifyComponent,
        loadChildren: () => import('../../programs/o001/o001.module').then(m => m.O001Module),
    },
    {
        path: 'P016',
        component: ModifyComponent,
        loadChildren: () => import('../../programs/p016/p016.module').then(m => m.P016Module),
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}