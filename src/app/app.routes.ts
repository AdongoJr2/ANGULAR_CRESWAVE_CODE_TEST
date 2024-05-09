import { Routes } from '@angular/router';
import { PageNotFoundComponent } from '@features/page-not-found';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    loadChildren: () => import('@features/tasks/tasks.routes').then(r => r.routes),
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'Task Manager | 404 - Page Not Found',
  },
];
