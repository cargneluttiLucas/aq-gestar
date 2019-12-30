import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'new-project', loadChildren: './pages/new-project/new-project.module#NewProjectModule' },
  { path: 'requirements', loadChildren: './pages/requirements/requirements.module#RequirementsModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
