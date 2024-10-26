import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExitLoginGuard } from '@site/guards/exit-login.guard';
import { LoginGuard } from '@site/guards/login.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [ExitLoginGuard],
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '',
    canActivate: [LoginGuard],
    loadChildren: () => import('./site/site.module').then((m) => m.SiteModule),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
