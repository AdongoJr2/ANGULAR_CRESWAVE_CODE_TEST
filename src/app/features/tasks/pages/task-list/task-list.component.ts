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
import { finalize, Subject, takeUntil } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskDeletionDialogComponent } from '@features/tasks/components/task-deletion-dialog/task-deletion-dialog.component';

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
    NgxSkeletonLoaderModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
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
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.retrieveTasks();
  }

  taskList: Array<TaskItem> = [];

  isRetrievingTaskList = false;

  private retrieveTasks() {
    this.isRetrievingTaskList = true;

    this.tasksService.getTasks()
      .pipe(takeUntilDestroyed(), finalize(() => this.isRetrievingTaskList = false))
      .subscribe({
        next: (taskItems) => {
          this.taskList = taskItems;
          this.dataSource = new MatTableDataSource<TaskItem>(this.taskList);
          if (this.paginator) this.dataSource.paginator = this.paginator;
        },
        error: () => {
          this.snackBar.open('Failed to fetch tasks', 'X', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000,
          });
        },
      });
  }

  handleTaskItemClick(taskItem: TaskItem) {
    this.navigateToDetailsPage(taskItem.id);
  }

  handleTaskEditBtnClick(taskItem: TaskItem) {
    this.navigateToDetailsPage(taskItem.id);
  }

  private navigateToDetailsPage(taskItemId: number) {
    this.router.navigate([taskItemId], { relativeTo: this.route });
  }

  navigateToNewTaskPage() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  openTaskDeletionConfirmationDialog(taskItem: TaskItem) {
    const dialogRef = this.dialog.open(TaskDeletionDialogComponent, {
      data: taskItem,
      disableClose: true,
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: result => {
          this.handleTaskDeletionSuccess(<number>result?.data?.taskItemId);

          this.snackBar.open('Task deleted successfully', 'X', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000,
          });
        },
      });
  }

  handleTaskDeletionSuccess(taskItemId?: number) {
    if (!taskItemId) return;

    this.taskList = this.taskList.filter(item => item.id !== taskItemId);
    this.dataSource = new MatTableDataSource<TaskItem>(this.taskList);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
