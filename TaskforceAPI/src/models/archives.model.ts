// Archives model for storing archived data
export interface Archive {
  id?: number;
  snapshot_date?: string;
  snapshot_time?: string;
  shift?: string;
  aircraft_tail?: string;
  data_json?: any;
}

export interface ArchiveRequest {
  shift?: string;
  aircraft_tail?: string;
  snapshot_date?: string;
  cutoff_date?: string; // Optional: archive records before this date
}
