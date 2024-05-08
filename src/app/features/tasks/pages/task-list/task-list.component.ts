import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

export type TaskItemStatus = 'complete' | 'incomplete';

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: TaskItemStatus;
}

const taskList: Array<TaskItem> = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Task 1\'s description goes here',
    status: 'incomplete',
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Task 2\'s description goes here',
    status: 'incomplete',
  },
  {
    id: 3,
    title: 'Task 3',
    description: 'Task 3\'s description goes here',
    status: 'complete',
  },
  {
    id: 4,
    title: 'Task 4',
    description: 'Task 4\'s description goes here',
    status: 'complete',
  },
  {
    id: 5,
    title: 'Task 5',
    description: 'Task 5\'s description goes here',
    status: 'incomplete',
  },
  {
    id: 6,
    title: 'Task 6',
    description: 'Task 6\'s description goes here',
    status: 'incomplete',
  },
];

type TableColumnName = keyof TaskItem | 'actions';

@Component({
  selector: 'app-tasklist',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: 'task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements AfterViewInit {
  displayedColumns: Array<TableColumnName> = ['id', 'title', 'description', 'status', 'actions'];
  dataSource = new MatTableDataSource<TaskItem>(taskList);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  handleTaskItemClick(taskItem: TaskItem) {
    console.log(`Task Item Click ==== `, taskItem);
  }

  handleTaskEditBtnClick(taskItem: TaskItem) {
    console.log(`Task Item [Edit] Click ==== `, taskItem);
  }

  handleTaskDeleteBtnClick(taskItem: TaskItem) {
    console.log(`Task Item [Delete] Click ==== `, taskItem);
  }
}
