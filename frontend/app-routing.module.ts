1  import { NgModule } from '@angular/core';
2  import { Routes, RouterModule } from '@angular/router';

4  import { HomeComponent } from './home';
5  import { AuthGuard } from './_helpers';
6  import { Role } from './_models';

8  const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
9  const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
10 const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);

12 const routes: Routes = [
13   { path: '', component: HomeComponent, canActivate: [AuthGuard] },
14   { path: 'account', loadChildren: accountModule },
15   { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
16   { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },

18   // otherwise redirect to home
19   { path: '**', redirectTo: '' }
20 ];

22 @NgModule({
23   imports: [RouterModule.forRoot(routes)],
24   exports: [RouterModule]
25 })
27 export class AppRoutingModule { }