import { OkPacket } from 'mysql';
import { execute } from '../services/mysql.connector';
import { Assignment, AssignmentTaskView } from '../models/assignments.model';
import { assignmentQueries } from '../queries/assignments.queries';

export const getAllAssignments = async () => {
  return await execute<AssignmentTaskView[]>(assignmentQueries.getAllAssignments, []);
};

export const getAssignmentById = async (id: number) => {
  return await execute<AssignmentTaskView[]>(assignmentQueries.getAssignmentById, [id]);
};

export const createAssignment = async (assignment: Assignment) => {
  return await execute<OkPacket>(assignmentQueries.createAssignment, [
    assignment.task_id,
    assignment.personnel_id,
    assignment.role,
  ]);
};

export const updateAssignment = async (id: number, assignment: Assignment) => {
  return await execute<OkPacket>(assignmentQueries.updateAssignment, [
    assignment.task_id,
    assignment.personnel_id,
    assignment.role,
    id,
  ]);
};

export const deleteAssignment = async (id: number) => {
  return await execute<OkPacket>(assignmentQueries.deleteAssignment, [id]);
};
