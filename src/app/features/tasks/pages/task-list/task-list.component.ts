import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasklist',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: 'task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent { }
