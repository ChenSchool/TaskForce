import { OkPacket } from 'mysql';
import { execute } from '../services/mysql.connector';
import { taskQueries } from '../queries/task.queries';
import { Task } from '../models/tasks.model';

export const getAllTasks = async () => {
  return await execute<Task[]>(taskQueries.getAllTasks, []);
}

export const getTaskById = async (id: number) => {
  return await execute<Task[]>(taskQueries.getTasksById, [id]);
}

export const getTaskByAircraftId = async (id: number) => {
  return await execute<Task[]>(taskQueries.getTaskByAircraftId, [id]);
}

export const createTask = async (task: Task) => {
  return await execute<OkPacket>(taskQueries.createTask, [
    task.aircraft_id,
    task.shift,
    task.description,
    task.status,
    task.date,
  ]);
}

export const updateTask = async (id: number, task: Task) => {
  return await execute<OkPacket>(taskQueries.updateTask, [
    task.aircraft_id,
    task.shift,
    task.description,
    task.status,
    task.date,
    id,
  ]);
}

export const deleteTask = async (id: number) => {
  return await execute<OkPacket>(taskQueries.removeTask, [id]);
}

