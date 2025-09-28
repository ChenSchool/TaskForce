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
    const [assignment] = await AssignmentDao.getAssignmentById(assignmentId);

    if (!assignment) {
      res.status(404).json({ error: "Assignment not found" });
      return;
    }

    res.status(200).json(assignment);
  } catch (error) {
    console.error("[assignments.controller][GetAssignmentById][Error]", error);
    res.status(500).json({ error: "Failed to fetch assignment" });
  }
}; // Get assignment by id

export const create: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const newAssignment: Assignment = req.body;
    const result: OkPacket = await AssignmentDao.createAssignment(newAssignment);

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error("[assignments.controller][CreateAssignment][Error]", error);
    res.status(500).json({ error: "Failed to create assignment" });
  }
}; // Create new assignment

export const update: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignmentId = Number(req.params.id);
    const updatedAssignment: Assignment = req.body;
    const result: OkPacket = await AssignmentDao.updateAssignment(assignmentId, updatedAssignment);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Assignment not found" });
      return;
    }

    res.status(200).json({ message: "Assignment updated successfully" });
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

