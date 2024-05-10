import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TasksService } from '../../services/tasks.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TaskUpdateDto } from '@features/tasks/dtos/task0update.dto';
import { Router, RouterLink } from '@angular/router';
import { TaskItemStatus } from '@features/tasks/models/task-item-status';
import { TaskItem } from '@features/tasks/models/task-item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormLoaderSkeletonComponent } from '@features/tasks/components/form-loader-skeleton/form-loader-skeleton.component';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    FormLoaderSkeletonComponent,
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent implements OnDestroy {
  destroy$ = new Subject<void>();

  private tasksService = inject(TasksService);

  readonly TaskItemStatus = TaskItemStatus;
  taskItemStatusValues = Object.values(TaskItemStatus)

  taskItemId: number | null = null;

  @Input()
  set taskId(taskId: string) {
    this.taskItemId = +taskId;
    this.retrieveTaskItem(this.taskItemId);
  }

  taskForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    status: this.formBuilder.control<TaskItemStatus | null>(null, { validators: [Validators.required] }),
  });

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar,
  ) { }

  get title() {
    return this.taskForm.controls.title;
  }

  get description() {
    return this.taskForm.controls.description;
  }

  get status() {
    return this.taskForm.controls.status;
  }

  taskItem?: TaskItem;
  isRetrievingTaskItem = false;
  isRetrievingTaskItemError = false;

  private retrieveTaskItem(taskItemId: number) {
    this.isRetrievingTaskItem = true;
    this.isRetrievingTaskItemError = false;
    
    this.tasksService.getTaskById(taskItemId)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isRetrievingTaskItem = false))
      .subscribe({
        next: taskItem => {
          this.taskItem = taskItem;
          this.updateFormFields(this.taskItem);
        },
        error: () => {
          this.isRetrievingTaskItemError = true;
        },
      });
  }

  private updateFormFields(taskItem?: TaskItem) {
    this.taskForm.patchValue({
      title: taskItem?.title,
      description: taskItem?.description,
      status: taskItem?.status,
    });
  }

  onSubmit() {
    if (this.taskForm.invalid) return;

    const { title, description, status } = this.taskForm.value;

    const taskUpdateDto: TaskUpdateDto = {
      title: title ?? this.taskItem?.status,
      description: description ?? this.taskItem?.description,
      status: status ?? this.taskItem?.status,
    };

    this.updateTask(taskUpdateDto);
  }

  isUpdatingtask = false;

  private updateTask(taskUpdateDto: TaskUpdateDto) {
    if (!this.taskItemId) return;

    this.isUpdatingtask = true;

    this.tasksService.updateTask(this.taskItemId, taskUpdateDto)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isUpdatingtask = false))
      .subscribe({
        next: (updatedTask) => {
          this.updateFormFields(updatedTask);
          this.navigateToTaskListPage();
          this.snackBar.open('Task updated successfully', 'X', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000,
          });
        },
        error: () => {
          this.snackBar.open('Failed to update task', 'X', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000,
          });
        }
      });
  }

  navigateToTaskListPage() {
    this.router.navigate(['/tasks']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
