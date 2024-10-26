import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { MirComponent } from "./mir.component";

const routes: Routes = [
    {
        path: '',
        component: MirComponent,
    },
    {
        path: 'P016',
        loadChildren: () => import('./p016/p016.module').then(m => m.P016Module)
    },
    {
        path: 'M001',
        loadChildren: () => import('./m001/m001.module').then(m => m.M001Module)
    },
    {
        path: 'O001',
        loadChildren: () => import('./o001/o001.module').then(m => m.O001Module)
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule {}