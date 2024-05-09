import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { TaskItem } from '../../models/task-item';
import { TaskItemStatus } from '../../models/task-item-status';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type TableColumnName = keyof TaskItem | 'actions';

@Component({
  selector: 'app-tasklist',
  standalone: true,
  imports: [
    CommonModule,
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
  dataSource = new MatTableDataSource<TaskItem>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private tasksService = inject(TasksService);

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.retrieveTasks();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  taskList: Array<TaskItem> = [];

  private retrieveTasks() {
    this.tasksService.getTasks()
    .pipe(takeUntilDestroyed())
    .subscribe(taskItems => {
      this.taskList = taskItems;
      this.dataSource = new MatTableDataSource<TaskItem>(this.taskList);
    });
  }

  handleTaskItemClick(taskItem: TaskItem) {
    this.navigateToDetailsPage(taskItem.id);
  }
  
  handleTaskEditBtnClick(taskItem: TaskItem) {
    this.navigateToDetailsPage(taskItem.id);
  }
  
  private navigateToDetailsPage(taskItemId: number) {
    this.router.navigate([`${taskItemId}/details`], { relativeTo: this.route });
  }

  handleTaskDeleteBtnClick(taskItem: TaskItem) {
    console.log(`Task Item [Delete] Click ==== `, taskItem);
  }
}
export { TaskItem, TaskItemStatus };

