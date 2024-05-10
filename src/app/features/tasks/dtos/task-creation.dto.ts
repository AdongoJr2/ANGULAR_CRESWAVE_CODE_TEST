import { TaskItem } from "../models/task-item";

export type TaskCreationDto = Omit<TaskItem, 'id'>;
