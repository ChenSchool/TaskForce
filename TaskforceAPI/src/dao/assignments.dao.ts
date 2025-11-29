/**
 * Assignments data access object (DAO) module.
 * Provides database operations for assignment management linking personnel to tasks.
 */
import { OkPacket } from 'mysql';
import { execute } from '../services/mysql.connector';
import { Assignment, AssignmentTaskView } from '../models/assignments.model';
import { assignmentQueries } from '../queries/assignments.queries';

/** Fetch all assignments with task details. */
export const getAllAssignments = async () => {
  return await execute<AssignmentTaskView[]>(assignmentQueries.getAllAssignments, []);
};

/** Fetch an assignment by ID with task details. */
export const getAssignmentById = async (id: number) => {
  return await execute<AssignmentTaskView[]>(assignmentQueries.getAssignmentById, [id]);
};

/** Create a new assignment linking personnel to a task. */
export const createAssignment = async (assignment: Assignment) => {
  return await execute<OkPacket>(assignmentQueries.createAssignment, [
    assignment.task_id,
    assignment.personnel_id,
    assignment.role,
  ]);
};

/** Update an existing assignment. */
export const updateAssignment = async (id: number, assignment: Assignment) => {
  return await execute<OkPacket>(assignmentQueries.updateAssignment, [
    assignment.task_id,
    assignment.personnel_id,
    assignment.role,
    id,
  ]);
};

/** Delete an assignment by ID. */
export const deleteAssignment = async (id: number) => {
  return await execute<OkPacket>(assignmentQueries.deleteAssignment, [id]);
};

/** Fetch all assignments for a specific task. */
export const getAssignmentsByTaskId = async (taskId: number) => {
  return await execute<any[]>(assignmentQueries.getAssignmentsByTaskId, [taskId]);
};

/** Delete all assignments associated with a specific task. */
export const deleteAssignmentsByTaskId = async (taskId: number) => {
  return await execute<OkPacket>(assignmentQueries.deleteAssignmentsByTaskId, [taskId]);
};

/** Fetch all assignments for a specific personnel member. */
export const getAssignmentsByPersonnelId = async (personnelId: number) => {
  return await execute<any[]>(assignmentQueries.getAssignmentsByPersonnelId, [personnelId]);
};

/** Delete all assignments associated with a specific personnel member. */
export const deleteAssignmentsByPersonnelId = async (personnelId: number) => {
  return await execute<OkPacket>(assignmentQueries.deleteAssignmentsByPersonnelId, [personnelId]);
};
