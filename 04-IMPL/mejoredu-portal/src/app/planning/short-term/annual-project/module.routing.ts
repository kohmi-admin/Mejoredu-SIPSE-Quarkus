import { RouterModule, Routes } from "@angular/router";
import { AnnualProjectComponent } from "./annual-project.component";
import { NgModule } from "@angular/core";


const routes: Routes = [
    {
        path: '',
        component: AnnualProjectComponent,
    },
    {
      path: 'Cargar Archivo',
      loadChildren: () => import('./upload-file/upload-file.module').then(m => m.UploadFileModule)
    },
    {
      path: 'Formularios',
      loadChildren: () => import('./form/form.module').then(m => m.FormModule)
    },
    { path: '', pathMatch: 'full', redirectTo: '' },
    { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnnualProjectRoutingModule { }