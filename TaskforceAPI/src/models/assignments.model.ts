import { Role } from './personnel.model';

export interface Assignment {
  id: number;
  task_id: number;
  personnel_id: number;
  personnel_name: string;
  role: Role;
}

// used by GET /assignments and GET /assignments/:id
export interface AssignmentTaskView {
  assignment_id:    number;
  task_id:          number;
  aircraft_tail:    string;
  task_description: string;
  task_status:      string;
  personnel_name:   string;
  assignment_role:  string;
}