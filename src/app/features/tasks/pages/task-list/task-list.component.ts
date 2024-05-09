import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { TaskItem } from '../../models/task-item';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, takeUntil } from 'rxjs';

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
export class TaskListComponent implements OnDestroy {
  destroy$ = new Subject<void>();

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

  taskList: Array<TaskItem> = [];

  private retrieveTasks() {
    this.tasksService.getTasks()
      .pipe(takeUntilDestroyed())
      .subscribe(taskItems => {
        this.taskList = taskItems;
        this.dataSource = new MatTableDataSource<TaskItem>(this.taskList);
        if (this.paginator) this.dataSource.paginator = this.paginator;
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

  navigateToNewTaskPage() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  handleTaskDeleteBtnClick(taskItem: TaskItem) {
    this.deleteTask(taskItem.id);
  }

  private deleteTask(taskItemId: number) {
    this.tasksService.deleteTask(taskItemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.taskList = this.taskList.filter(item => item.id !== taskItemId);
        this.dataSource = new MatTableDataSource<TaskItem>(this.taskList);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
