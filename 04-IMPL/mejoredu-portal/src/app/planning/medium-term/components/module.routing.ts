import { RouterModule, Routes } from "@angular/router";
import { RecordComponent } from "./record.component";
import { NgModule } from "@angular/core";


const routes: Routes = [
    {
        path: '',
        component: RecordComponent,
        loadChildren: () => import('../components/structure/structure.module').then(m => m.StructureModule),
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}