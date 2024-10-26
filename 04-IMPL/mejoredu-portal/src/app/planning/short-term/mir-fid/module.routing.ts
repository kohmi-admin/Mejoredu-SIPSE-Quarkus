import { RouterModule, Routes } from "@angular/router";
import { MirFidComponent } from "./mir-fid.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: '',
        component: MirFidComponent,
    },
    { path: '', pathMatch: 'full', redirectTo: '' },
    { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}