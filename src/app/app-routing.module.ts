import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'new-project', loadChildren: './pages/new-project/new-project.module#NewProjectModule' },
  { path: 'requirements', loadChildren: './pages/requirements/requirements.module#RequirementsModule' },
  { path: 'sprint', loadChildren: './pages/sprint/sprint.module#SprintModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomeModule' },
  { path: '', pathMatch: 'full', redirectTo: '/new-project' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }