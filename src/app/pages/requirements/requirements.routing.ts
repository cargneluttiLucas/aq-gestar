import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequirementsComponent } from './requirements.component';

const routes: Routes = [
  {
    path: '',
    component: RequirementsComponent,
    children: [
      {
        path: 'requirements',
        component: RequirementsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequirementsRoutingModule { }
