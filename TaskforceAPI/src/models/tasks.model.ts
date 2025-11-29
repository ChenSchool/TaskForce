/**
 * Task model type definitions.
 * Defines maintenance task entities with shift assignments and status tracking.
 */
export type Shift = '1st' | '2nd' | '3rd';
export type Status = 'Incomplete' | 'Complete';

/** Maintenance task entity with aircraft association and status. */
export interface Task {
  id: number;
  aircraft_id: number;
  shift: Shift;
  description: string;
  status: Status;
  date: string; // YYYY-MM-DD
}