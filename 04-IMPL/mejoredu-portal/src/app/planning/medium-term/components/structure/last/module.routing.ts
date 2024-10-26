import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { LastComponent } from "./last.component";


const routes: Routes = [
    {
        path: '',
        component: LastComponent,
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}