import { RouterModule, Routes } from "@angular/router";
import { BudgetComponent } from "./budget.component";
import { NgModule } from "@angular/core";
import { ProgramsComponent } from "./programs/programs.component";


const routes: Routes = [
    {
        path: '',
        component: BudgetComponent,
    },
    {
        path: 'Registro',
        component: ProgramsComponent
    },
    {
        path: 'Registro',
        loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)
    },
    {
        path: 'Actualización',
        loadChildren: () => import('./update/update.module').then(m => m.UpdateModule)
    },
    {
        path: 'Validación',
        loadChildren: () => import('./review/review.module').then(m => m.ReviewModule)
    },
    {
        path: 'Consulta',
        loadChildren: () => import('./consulting/consulting.module').then(m => m.ConsultingModule)
    },
    { path: '**', redirectTo: '' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }