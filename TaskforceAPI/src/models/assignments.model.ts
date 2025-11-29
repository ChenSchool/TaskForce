/**
 * Assignment model type definitions.
 * Defines assignment entities linking personnel to tasks with role specifications and view projections.
 */
import { Role } from './personnel.model';

/** Assignment entity linking personnel to a task. */
export interface Assignment {
  id: number;
  task_id: number;
  personnel_id: number;
  personnel_name: string;
  role: Role;
}

/** Joined view for assignments with task and aircraft details. */
export interface AssignmentTaskView {
  assignment_id:    number;
  task_id:          number;
  aircraft_tail:    string;
  task_description: string;
  task_status:      string;
  personnel_name:   string;
  assignment_role:  string;
}