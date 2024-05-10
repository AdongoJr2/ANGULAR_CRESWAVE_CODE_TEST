import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
import { TaskItem } from '@features/tasks/models/task-item';
import { TasksService } from '@features/tasks/services/tasks.service';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-deletion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './task-deletion-dialog.component.html',
  styleUrl: './task-deletion-dialog.component.scss',
})
export class TaskDeletionDialogComponent implements OnDestroy {
  destroy$ = new Subject<void>();

  private tasksService = inject(TasksService);

  taskDeletionSuccess = new EventEmitter<number>();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: TaskItem,
    public dialogRef: MatDialogRef<TaskDeletionDialogComponent>,
  ) { }

  handleTaskDeleteBtnClick(taskItem: TaskItem) {
    this.deleteTask(taskItem.id);
  }

  isDeletingTask = false;

  private deleteTask(taskItemId: number) {
    this.isDeletingTask = true;

    this.tasksService.deleteTask(taskItemId)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isDeletingTask = false))
      .subscribe({
        next: () => {
          this.dialogRef.close({ data: { taskItemId } });
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
