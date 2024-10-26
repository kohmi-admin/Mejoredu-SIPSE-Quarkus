import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { UsuariosComponent } from "./usuarios.component";

const routes: Routes = [
    {
        path: '',
        component: UsuariosComponent,
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }