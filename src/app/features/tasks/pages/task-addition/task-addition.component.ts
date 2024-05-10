import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TasksService } from '@features/tasks/services/tasks.service';
import { TaskCreationDto } from '@features/tasks/dtos/task-creation.dto';
import { TaskItemStatus } from '@features/tasks/models/task-item-status';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-task-addition',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: 'task-addition.component.html',
  styleUrl: './task-addition.component.scss',
})
export class TaskAdditionComponent implements OnDestroy {
  destroy$ = new Subject<void>();

  private tasksService = inject(TasksService);

  readonly TaskItemStatus = TaskItemStatus;
  taskItemStatusValues = Object.values(TaskItemStatus)

  taskForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    status: this.formBuilder.control<TaskItemStatus | null>(TaskItemStatus.INCOMPLETE, { validators: [Validators.required] }),
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

  onSubmit() {
    if (this.taskForm.invalid) return;

    const { title, description, status } = this.taskForm.value;

    const taskCreationDto: TaskCreationDto = {
      title: title!,
      description: description!,
      status: status!,
    };

    this.addTask(taskCreationDto);
  }

  isAddingTask = false;
  
  private addTask(taskCreationDto: TaskCreationDto) {
    this.isAddingTask = true;

    this.tasksService.addTask(taskCreationDto)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isAddingTask = false))
      .subscribe({
        next: () => {
          this.snackBar.open('Task added successfully', 'X', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000,
          });

          this.navigateToTaskListPage();
        },
        error: () => {
          this.snackBar.open('Failed to add task', 'X', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000,
          });
        },
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
