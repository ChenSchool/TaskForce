import { Request, RequestHandler, Response } from "express";
import { Assignment } from "../models/assignments.model";
import * as AssignmentDao from "../dao/assignments.dao";
import { OkPacket } from "mysql";

// This controller handles the CRUD operations for assignments
export const getAll: RequestHandler = async (req: Request, res: Response) => {
  try {
    const assignments = await AssignmentDao.getAllAssignments();
    res.status(200).json(assignments);
  } catch (error) {
    console.error("[assignments.controller][GetAllAssignments][Error]", error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
}; // Get all assignments

export const getById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignmentId = Number(req.params.id);
    
    // Check if this is actually a task_id (for getting all assignments by task)
    // We'll use a different endpoint for this, but for backward compatibility
    // let's try to get the assignment first
    const [assignment] = await AssignmentDao.getAssignmentById(assignmentId);

    if (!assignment) {
      res.status(404).json({ error: "Assignment not found" });
      return;
    }

    // Get all assignments for this task to return as "lines"
    const taskId = assignment.task_id;
    const allAssignments = await AssignmentDao.getAssignmentsByTaskId(taskId);
    
    // Transform to match frontend expectations
    const response = {
      task_id: taskId,
      lines: allAssignments.map((a: any) => ({
        personnel_id: a.personnel_id,
        role: a.role
      }))
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("[assignments.controller][GetAssignmentById][Error]", error);
    res.status(500).json({ error: "Failed to fetch assignment" });
  }
}; // Get assignment by id

export const create: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { task_id, lines } = req.body;
    
    // Validate input
    if (!task_id || !lines || !Array.isArray(lines) || lines.length === 0) {
      res.status(400).json({ error: "Invalid request: task_id and lines array required" });
      return;
    }

    // Create multiple assignments for the task
    const results = [];
    for (const line of lines) {
      const newAssignment: Assignment = {
        task_id,
        personnel_id: line.personnel_id,
        role: line.role,
      } as Assignment;
      
      const result: OkPacket = await AssignmentDao.createAssignment(newAssignment);
      results.push(result.insertId);
    }

    res.status(201).json({ ids: results, message: "Assignments created successfully" });
  } catch (error) {
    console.error("[assignments.controller][CreateAssignment][Error]", error);
    res.status(500).json({ error: "Failed to create assignment" });
  }
}; // Create new assignment

export const update: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignmentId = Number(req.params.id);
    const { task_id, lines } = req.body;
    
    // Validate input
    if (!task_id || !lines || !Array.isArray(lines) || lines.length === 0) {
      res.status(400).json({ error: "Invalid request: task_id and lines array required" });
      return;
    }

    // First, get the first assignment to verify it exists and get the task_id
    const [existingAssignment] = await AssignmentDao.getAssignmentById(assignmentId);
    
    if (!existingAssignment) {
      res.status(404).json({ error: "Assignment not found" });
      return;
    }

    // Delete all existing assignments for this task
    await AssignmentDao.deleteAssignmentsByTaskId(task_id);

    // Create new assignments based on the lines array
    const results = [];
    for (const line of lines) {
      const newAssignment: Assignment = {
        task_id,
        personnel_id: line.personnel_id,
        role: line.role,
      } as Assignment;
      
      const result: OkPacket = await AssignmentDao.createAssignment(newAssignment);
      results.push(result.insertId);
    }

    res.status(200).json({ message: "Assignments updated successfully", ids: results });
  } catch (error) {
    console.error("[assignments.controller][UpdateAssignment][Error]", error);
    res.status(500).json({ error: "Failed to update assignment" });
  }
}; // Update assignment by id

export const remove: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignmentId = Number(req.params.id);
    const result: OkPacket = await AssignmentDao.deleteAssignment(assignmentId);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Assignment not found" });
      return;
    }

    res.status(200).json({message: 'Assignment deleted successfully'});
  } catch (error) {
    console.error("[assignments.controller][DeleteAssignment][Error]", error);
    res.status(500).json({ error: "Failed to delete assignment" });
  }
}; // Delete assignment by id

export const getByTaskId: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = Number(req.params.taskId);
    const assignments = await AssignmentDao.getAssignmentsByTaskId(taskId);
    
    if (!assignments || assignments.length === 0) {
      res.status(200).json({ task_id: taskId, lines: [] });
      return;
    }

    const response = {
      task_id: taskId,
      lines: assignments.map((a: any) => ({
        personnel_id: a.personnel_id,
        role: a.role
      }))
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("[assignments.controller][GetByTaskId][Error]", error);
    res.status(500).json({ error: "Failed to fetch assignments for task" });
  }
}; // Get all assignments for a task

export const getByPersonnelId: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const personnelId = Number(req.params.personnelId);
    const assignments = await AssignmentDao.getAssignmentsByPersonnelId(personnelId);
    
    res.status(200).json(assignments);
  } catch (error) {
    console.error("[assignments.controller][GetByPersonnelId][Error]", error);
    res.status(500).json({ error: "Failed to fetch assignments for personnel" });
  }
}; // Get all assignments for a personnel member

export const deleteByPersonnelId: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const personnelId = Number(req.params.personnelId);
    const result: OkPacket = await AssignmentDao.deleteAssignmentsByPersonnelId(personnelId);
    
    res.status(200).json({ 
      message: `Deleted ${result.affectedRows} assignment(s) for personnel`,
      affectedRows: result.affectedRows 
    });
  } catch (error) {
    console.error("[assignments.controller][DeleteByPersonnelId][Error]", error);
    res.status(500).json({ error: "Failed to delete assignments for personnel" });
  }
}; // Delete all assignments for a personnel member
