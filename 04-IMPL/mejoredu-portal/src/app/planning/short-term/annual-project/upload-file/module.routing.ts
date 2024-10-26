import { RouterModule, Routes } from "@angular/router";
import { UploadFileComponent } from "./upload-file.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: '',
        component: UploadFileComponent
    },
    { path: '', pathMatch: 'full', redirectTo: '' },
    { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }