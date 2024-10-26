import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { EpilogueComponent } from "./epilogue.component";


const routes: Routes = [
    {
        path: '',
        component: EpilogueComponent,
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}