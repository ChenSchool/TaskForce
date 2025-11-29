/**
 * Tasks data access object (DAO) module.
 * Provides database operations for maintenance task management.
 */
import { OkPacket } from 'mysql';
import { execute } from '../services/mysql.connector';
import { taskQueries } from '../queries/task.queries';
import { Task } from '../models/tasks.model';

/** Fetch all tasks. */
export const getAllTasks = async () => {
  return await execute<Task[]>(taskQueries.getAllTasks, []);
}

/** Fetch a task by ID. */
export const getTaskById = async (id: number) => {
  return await execute<Task[]>(taskQueries.getTasksById, [id]);
}

/** Fetch all tasks for a specific aircraft. */
export const getTaskByAircraftId = async (id: number) => {
  return await execute<Task[]>(taskQueries.getTaskByAircraftId, [id]);
}

/** Create a new task. */
export const createTask = async (task: Task) => {
  return await execute<OkPacket>(taskQueries.createTask, [
    task.aircraft_id,
    task.shift,
    task.description,
    task.status,
    task.date,
  ]);
}

/** Update an existing task. */
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

/** Delete a task by ID. */
export const deleteTask = async (id: number) => {
  return await execute<OkPacket>(taskQueries.removeTask, [id]);
}

