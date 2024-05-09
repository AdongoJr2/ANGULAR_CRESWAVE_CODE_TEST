import { Routes } from '@angular/router';
import { TasksComponent } from './tasks.component';
import { TaskListComponent, TaskDetailsComponent, TaskAdditionComponent } from './pages';

export const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
    title: 'Task Manager | Tasks',
    children: [
      {
        path: '',
        component: TaskListComponent,
        title: 'Task Manager | Tasks',
      },
      {
        path: 'new',
        component: TaskAdditionComponent,
        title: 'Task Manager | Add Task',
      },
      {
        path: ':taskId/details',
        component: TaskDetailsComponent,
        title: 'Task Manager | Task Details',
      },
    ],
  },
];