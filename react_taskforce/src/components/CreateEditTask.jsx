/**
 * CreateEditTask component.
 * Form for creating or editing maintenance tasks with aircraft association, shift, status, and date selection.
 */
import React, { useState, useEffect } from 'react';
import { getAllAircraft } from '../api/aircraft';
import { getTaskById, createTask, updateTask } from '../api/tasks';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../utils/validation';
import { toast } from 'react-toastify';

/**
 * Task form component with comprehensive validation for all required fields and aircraft selection.
 */
export default function CreateEditTask() {
  const [desc, setDesc] = useState('');
  const [shift, setShift] = useState('1st');
  const [status, setStatus] = useState('Incomplete');
  const [date, setDate] = useState('');
  const [aircraft, setAircraft] = useState([]);
  const [aircraftId, setAircraftId] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const nav = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  useEffect(() => {
    getAllAircraft().then(setAircraft);
    if (editing) {
      getTaskById(id).then(t => {
        setDesc(t.description);
        setShift(t.shift);
        setStatus(t.status);
        setDate(t.date);
        setAircraftId(t.aircraft_id);
      });
    }
  }, [editing, id]);

  const save = async () => {
    setError('');
    setFieldErrors({});

    // Client-side validation
    const errors = {};
    if (!desc || desc.trim() === '') {
      errors.description = 'Description is required';
    }
    if (!date) {
      errors.date = 'Date is required';
    }
    if (!aircraftId) {
      errors.aircraft_id = 'Aircraft selection is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fill in all required fields');
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const data = { description: desc, shift, status, date, aircraft_id: aircraftId };
      if (editing) {
        await updateTask(id, data);
        toast.success('Task updated successfully!');
      } else {
        await createTask(data);
        toast.success('Task created successfully!');
      }
      nav('/tasks');
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      toast.error(`Failed to ${editing ? 'update' : 'create'} task: ${errorMsg}`);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-8 col-lg-7">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                <i className="bi bi-list-task me-2"></i>
                {editing ? 'Edit' : 'Add'} Task
              </h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="aircraftId" className="form-label">Aircraft *</label>
                <select 
                  id="aircraftId"
                  className={`form-select ${fieldErrors.aircraft_id ? 'is-invalid' : ''}`}
                  value={aircraftId} 
                  onChange={e=>setAircraftId(e.target.value)}
                >
                  <option value="">-- Select Aircraft --</option>
                  {aircraft.map(a => <option key={a.id} value={a.id}>{a.tail_number}</option>)}
                </select>
                {fieldErrors.aircraft_id && (
                  <div className="invalid-feedback">{fieldErrors.aircraft_id}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="shift" className="form-label">Shift</label>
                <select id="shift" className="form-select" value={shift} onChange={e=>setShift(e.target.value)}>
                  <option>1st</option><option>2nd</option><option>3rd</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select id="status" className="form-select" value={status} onChange={e=>setStatus(e.target.value)}>
                  <option>Incomplete</option><option>Complete</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">Date *</label>
                <input 
                  type="date"
                  id="date" 
                  className={`form-control ${fieldErrors.date ? 'is-invalid' : ''}`}
                  value={date} 
                  onChange={e=>setDate(e.target.value)} 
                />
                {fieldErrors.date && (
                  <div className="invalid-feedback">{fieldErrors.date}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description *</label>
                <textarea 
                  id="description"
                  className={`form-control ${fieldErrors.description ? 'is-invalid' : ''}`}
                  value={desc} 
                  onChange={e=>setDesc(e.target.value)} 
                  rows="4"
                  placeholder="Enter task description"
                />
                {fieldErrors.description && (
                  <div className="invalid-feedback">{fieldErrors.description}</div>
                )}
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={save} disabled={!desc || !date || !aircraftId}>
                  <i className="bi bi-save me-2"></i> Save Task
                </button>
                <button className="btn btn-secondary" onClick={()=>nav('/tasks')}>
                  <i className="bi bi-arrow-left me-2"></i> Back to Tasks
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}