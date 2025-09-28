export type Specialty = 'A&P' | 'Avionics' | 'Integration' | 'AMT';
export type Role = 'Captain' | 'Coordinator' | 'Collaborator' | 'Trainee';

export interface Personnel {
  id: number;
  name: string;
  specialty: Specialty;
  role: Role;
}