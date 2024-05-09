import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskCreationDto } from '../dtos/task-creation.dto';
import { TaskUpdateDto } from '../dtos/task0update.dto';
import { map, Observable } from 'rxjs';
import { ApiResponseBody } from '../dtos/api-response-body';
import { TaskItem } from '../models/task-item';
import { environment } from '@environment/environment';
import { ApiResponseListBody } from '../dtos/api-response-list-body';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private readonly tasksApiUrl = `${environment.baseApiUrl}/tasks`;

  constructor(
    private readonly http: HttpClient,
  ) { }

    addTask(taskCreationDto: TaskCreationDto): Observable<TaskItem> {
      return this.http.post<ApiResponseBody<TaskItem>>(`${this.tasksApiUrl}`, taskCreationDto)
        .pipe(
          map((responseBody) => responseBody.data),
        );
    }

    getTasks(): Observable<TaskItem[]> {
      return this.http.get<ApiResponseListBody<TaskItem>>(`${this.tasksApiUrl}?pageSize=100`)
        .pipe(
          map((responseBody) => responseBody.data.list),
        );
    }
    
    getTaskById(taskId: number): Observable<TaskItem> {
      return this.http.get<ApiResponseBody<TaskItem>>(`${this.tasksApiUrl}/${taskId}`)
        .pipe(
          map((responseBody) => responseBody.data),
        );
    }
    
    updateTask(taskId: number, taskUpdateDto: TaskUpdateDto): Observable<TaskItem> {
      return this.http.patch<ApiResponseBody<TaskItem>>(`${this.tasksApiUrl}/${taskId}`, taskUpdateDto)
        .pipe(
          map((responseBody) => responseBody.data),
        );
    }
    
    deleteTask(taskId: number) {
      return this.http.delete<ApiResponseBody<Omit<TaskItem, 'data'>>>(`${this.tasksApiUrl}/${taskId}`)
        .pipe(
          map((responseBody) => responseBody.data),
        );
    }
}
