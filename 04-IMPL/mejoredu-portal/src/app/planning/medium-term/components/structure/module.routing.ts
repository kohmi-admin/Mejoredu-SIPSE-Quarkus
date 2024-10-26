import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { StructureComponent } from "./structure.component";
import { DirtyFormGuard } from "@common/guards/dirty-form-guard";


const routes: Routes = [
    {
        path: '',
        component: StructureComponent,
        canDeactivate: [DirtyFormGuard],
        children: [
            {
                path: 'Inicio',
                loadChildren: () => import('./principal/principal.module').then(m => m.PrincipalModule)
            },
            {
                path: 'Objetivos',
                loadChildren: () => import('./priority-objectives/priority-objectives.module').then(m => m.PriorityObjectivesModule)
            },
            {
                path: 'Estrategias y Acciones',
                loadChildren: () => import('./priority-strategies/priority-strategies.module').then(m => m.PriorityStrategiesModule)
            },
            {
                path: 'Acciones Puntuales',
                loadChildren: () => import('./specific-actions/specific-actions.module').then(m => m.SpecificActionsModule)
            },
            {
                path: 'Metas Para el Bienestar',
                loadChildren: () => import('./goals-for-well-being/goals-for-well-being.module').then(m => m.GoalsForWellBeingModule)
            },
            {
                path: 'Parámetros',
                loadChildren: () => import('./params/params.module').then(m => m.ParamsModule)
            },
            {
                path: 'Epílogo, Carga del PI y Actas',
                loadChildren: () => import('./epilogue/epilogue.module').then(m => m.EpilogueModule)
            },
            {
                path: 'Carga del PI y Actas',
                loadChildren: () => import('./last/last.module').then(m => m.LastModule)
            },
            { path: '**', redirectTo: 'Inicio' }
        ]
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RoutingModule {}