import { Request, RequestHandler, Response } from "express";
import * as dao from "../dao/tasks.dao";
import { Task } from "../models/tasks.model";
import { OkPacket } from "mysql";
import { Personnel } from "../models/personnel.model";
import * as PersonnelDao from "../dao/personnel.dao";
import * as AssignmentDao from "../dao/assignments.dao";
import { Assignment } from "../models/assignments.model";

export const getAll: RequestHandler = async (req: Request, res: Response) => {
  try {
    const tasks = await dao.getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("[tasks.controller][GetAllTasks][Error]", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
}

export const getById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = Number(req.params.id);
    const [task] = await dao.getTaskById(taskId);

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("[tasks.controller][GetTaskById][Error]", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
}

export const getByAircraftId: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const aircraftId = Number(req.params.id);
    const tasks = await dao.getTaskByAircraftId(aircraftId);

    if (!tasks) {
      res.status(404).json({ error: "Tasks not found" });
      return;
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error("[tasks.controller][GetTaskByAircraftId][Error]", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
}

export const create: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const newTask: Task = req.body;

    // Validate required fields
    if (!newTask.date || newTask.date.trim() === '') {
      res.status(400).json({ message: "Date is required for task creation" });
      return;
    }

    if (!newTask.aircraft_id) {
      res.status(400).json({ message: "Aircraft selection is required" });
      return;
    }

    if (!newTask.description || newTask.description.trim() === '') {
      res.status(400).json({ message: "Description is required and cannot be empty" });
      return;
    }

    if (!newTask.shift) {
      res.status(400).json({ message: "Shift selection is required" });
      return;
    }

    const result: OkPacket = await dao.createTask(newTask);

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error("[tasks.controller][CreateTask][Error]", error);
    res.status(500).json({ error: "Failed to create task" });
  }
}

export const update: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = Number(req.params.id);
    const updatedTask: Task = req.body;

    // Validate required fields
    if (!updatedTask.date || updatedTask.date.trim() === '') {
      res.status(400).json({ message: "Date is required for task update" });
      return;
    }

    if (!updatedTask.aircraft_id) {
      res.status(400).json({ message: "Aircraft selection is required" });
      return;
    }

    if (!updatedTask.description || updatedTask.description.trim() === '') {
      res.status(400).json({ message: "Description is required and cannot be empty" });
      return;
    }

    if (!updatedTask.shift) {
      res.status(400).json({ message: "Shift selection is required" });
      return;
    }

    const result: OkPacket = await dao.updateTask(taskId, updatedTask);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("[tasks.controller][UpdateTask][Error]", error);
    res.status(500).json({ error: "Failed to update task" });
  }
}

export const remove: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = Number(req.params.id);
    const result: OkPacket = await dao.deleteTask(taskId);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("[tasks.controller][DeleteTask][Error]", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
}
