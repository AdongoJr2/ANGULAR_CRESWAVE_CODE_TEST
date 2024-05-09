import { TaskItemStatus } from "./task-item-status";

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: TaskItemStatus;
}
