export type Shift = '1st' | '2nd' | '3rd';
export type Status = 'Incomplete' | 'Complete';

export interface Task {
  id: number;
  aircraft_id: number;
  shift: Shift;
  description: string;
  status: Status;
  date: string; // YYYY-MM-DD
}