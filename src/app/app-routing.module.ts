import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'new-project',
    loadChildren: './pages/new-project/new-project.module#NewProjectModule',
    data: {
      title: 'Nuevo proyecto',
      description: 'En esta seccion creamos un proyecto nuevo',
      canonicalUrl: '/new-project',
    },
  },
  {
    path: 'requirements',
    loadChildren: './pages/requirements/requirements.module#RequirementsModule',
    data: {
      title: 'Requerimientos',
      description: 'En esta seccion creamos requerimientos para un proyecto',
      canonicalUrl: '/requirements',
    },
  },
  { path: 'sprint', loadChildren: './pages/sprint/sprint.module#SprintModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomeModule' },
  { path: '**', redirectTo: '/new-project' },
  { path: '', pathMatch: 'full', redirectTo: '/new-project' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
