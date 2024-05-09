import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskItem, TaskItemStatus } from '../task-list/task-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TasksService } from '../../services/tasks.service';

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
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {
  private tasksService = inject(TasksService);

  readonly TaskItemStatus = TaskItemStatus;
  taskItemStatusValues = Object.values(TaskItemStatus)

  // TODO: retrieve from API (service)
  taskItem: TaskItem = {
    id: +this.taskId,
    title: 'Sample title',
    description: 'Sample description',
    status: TaskItemStatus.COMPLETE
  };

  @Input()
  set taskId(taskId: string) {
    console.log(taskId);

    this.updateFormFields(this.taskItem);
  }

  taskForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    status: this.formBuilder.control<TaskItemStatus | null>(null, { validators: [Validators.required] }),
  });

  constructor(
    private readonly formBuilder: FormBuilder,
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

  private updateFormFields(taskItem: TaskItem) {
    this.taskForm.patchValue({
      title: taskItem.title,
      description: taskItem.description,
      status: taskItem.status,
    });
  }

  onSubmit() {
    if (this.taskForm.invalid) return;

    const formValue = this.taskForm.value;

    console.log(formValue);
  }

}
