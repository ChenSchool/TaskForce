import React, { useState, useEffect } from 'react';
import { getAllPersonnel } from '../api/personnel';
import { getTrainingById, createTraining, updateTraining } from '../api/training';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateEditTraining() {
  const [personnelId, setPersonnelId] = useState('');
  const [phase, setPhase] = useState('');
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [people, setPeople] = useState([]);
  const nav = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  useEffect(() => {
    getAllPersonnel().then(setPeople);
    if (editing) {
      getTrainingById(id).then(t => {
        setPersonnelId(t.personnel_id);
        setPhase(t.phase || '');
        setProgress(t.progress || 0);
        setComplete(Boolean(t.complete));
      });
    }
  }, [editing, id]);

  const save = () => {
    const data = {
      personnel_id: personnelId,
      phase,
      progress: parseInt(progress),
      complete
    };
    const fn = editing ? updateTraining(id, data) : createTraining(data);
    fn.then(() => nav('/training'));
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-8 col-lg-7">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                <i className="bi bi-book me-2"></i>
                {editing ? 'Edit' : 'New'} Training Record
              </h2>
              
              <div className="mb-3">
                <label htmlFor="personnelId" className="form-label">Personnel *</label>
                <select 
                  id="personnelId"
                  className="form-select" 
                  value={personnelId} 
                  onChange={e => setPersonnelId(e.target.value)}>
                  <option value="">-- Select Personnel --</option>
                  {people.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="phase" className="form-label">Training Phase *</label>
                <input 
                  type="text"
                  id="phase" 
                  className="form-control" 
                  value={phase} 
                  onChange={e => setPhase(e.target.value)}
                  placeholder="e.g., Phase 1, Phase 2, Initial Training, etc." />
                <small className="form-text text-muted">
                  Enter the training phase or stage (e.g., "Phase 1", "Advanced", "Initial")
                </small>
              </div>

              <div className="mb-3">
                <label htmlFor="progress" className="form-label">Progress (0-100%)</label>
                <input 
                  type="number"
                  id="progress" 
                  className="form-control" 
                  value={progress} 
                  min="0" 
                  max="100"
                  onChange={e => setProgress(e.target.value)} />
                <div className="progress mt-2">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${progress}%` }}>
                    {progress}%
                  </div>
                </div>
              </div>

              <div className="mb-3 form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="completeCheck"
                  checked={complete} 
                  onChange={e => setComplete(e.target.checked)} />
                <label className="form-check-label" htmlFor="completeCheck">
                  Mark as Complete
                </label>
              </div>

              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary" 
                  onClick={save} 
                  disabled={!personnelId || !phase}>
                  <i className="bi bi-save me-2"></i>
                  Save
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => nav('/training')}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Training
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
