import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RegistroComponent } from "./registro.component";


const routes: Routes = [
    {
        path: '',
        component: RegistroComponent,
        loadChildren: () => import('../components/structure/structure.module').then(m => m.StructureModule),
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}