import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SprintComponent } from './sprint.component';

const routes: Routes = [
  {
    path: '',
    component: SprintComponent,
    children: [
      {
        path: 'home',
        component: SprintComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SprintRoutingModule { }
