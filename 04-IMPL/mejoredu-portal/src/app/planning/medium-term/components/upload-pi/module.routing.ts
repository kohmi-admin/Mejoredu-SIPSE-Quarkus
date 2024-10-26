import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { UploadPiComponent } from "./upload-pi.component";


const routes: Routes = [
    {
        path: '',
        component: UploadPiComponent,
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}