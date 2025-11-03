// Training model for personnel training records
export interface Training {
  id?: number;
  personnel_id: number;
  phase: string;
  progress: number;
  complete: boolean;
}

// View for training records with personnel details
export interface TrainingView extends Training {
  personnel_name: string;
  personnel_specialty?: string;
  personnel_role?: string;
}
