import { RouterModule, Routes } from "@angular/router";
import { ConfigurationComponent } from "./configuration.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: '',
        component: ConfigurationComponent,
        children: [
            {
                path: 'Unidades',
                loadChildren: () => import('./unidades/unidades.module').then(m => m.UnidadesModule)
            },
            {
                path: 'Direcciones',
                loadChildren: () => import('./direction/direction.module').then(m => m.DirectionModule)
            },
            {
                path: 'Roles',
                loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)
            },
            {
                path: 'Usuarios',
                loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule)
            },
            {
                path: 'Catálogos',
                loadChildren: () => import('./catalogos/catalogos.module').then(m => m.CatalogosModule)
            },
            {
                path: 'Catálogos',
                loadChildren: () => import('./catalogos/catalogos.module').then(m => m.CatalogosModule)
            },
            {
                path: 'Periódos de Habilitación',
                loadChildren: () => import('./period/period.module').then(m => m.PeriodModule)
            },
            {
                path: 'Notificaciones',
                loadChildren: () => import('./notificaciones/notificaciones.module').then(m => m.NotificacionesModule)
            },
            { path: '**', redirectTo: 'Unidades' },
        ]
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoutingModule { }