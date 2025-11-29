/**
 * Personnel model type definitions.
 * Defines personnel entities with specialties, roles, and shift assignments.
 */
export type Specialty = 'A&P' | 'Avionics' | 'Integration' | 'AMT';
export type Role = 'Captain' | 'Coordinator' | 'Collaborator' | 'Trainee';
export type Shift = '1st' | '2nd' | '3rd';

/** Personnel entity with specialty and role classification. */
export interface Personnel {
  id: number;
  name: string;
  specialty: Specialty;
  role: Role;
  shift: Shift;
}