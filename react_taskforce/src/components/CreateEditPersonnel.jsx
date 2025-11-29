/**
 * CreateEditPersonnel component.
 * Form for creating or editing personnel records with name, specialty, role, and shift selection.
 */
import React, { useState, useEffect } from 'react';
import { createPersonnel, getPersonnelById, updatePersonnel } from '../api/personnel';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../utils/validation';
import { toast } from 'react-toastify';

/**
 * Personnel form component with real-time name validation and dropdown selections for specialty, role, and shift.
 */
export default function CreateEditPersonnel() {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('A&P');
  const [role, setRole] = useState('Captain');
  const [shift, setShift] = useState('1st');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const nav = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  useEffect(() => {
    if (editing) {
      getPersonnelById(id).then(p => {
        setName(p.name);
        setSpecialty(p.specialty);
        setRole(p.role);
        setShift(p.shift || '1st');
      });
    }
  }, [editing, id]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    
    if (value && value.trim() === '') {
      setNameError('Name cannot be empty');
    } else if (value.length < 2) {
      setNameError('Name must be at least 2 characters');
    } else {
      setNameError('');
    }
  };

  const save = async () => {
    setError('');
    setNameError('');

    // Client-side validation
    if (!name || name.trim() === '') {
      setNameError('Name is required');
      setError('Personnel name is required. Please enter a valid name.');
      toast.error('Personnel name is required. Please enter a valid name.');
      return;
    }

    if (name.length < 2) {
      setNameError('Name must be at least 2 characters');
      setError('Personnel name must be at least 2 characters long.');
      toast.error('Personnel name must be at least 2 characters long.');
      return;
    }

    try {
      const data = { name, specialty, role, shift };
      if (editing) {
        await updatePersonnel(id, data);
        toast.success('Personnel updated successfully!');
      } else {
        await createPersonnel(data);
        toast.success('Personnel created successfully!');
      }
      nav('/personnel');
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      toast.error(`Failed to ${editing ? 'update' : 'create'} personnel: ${errorMsg}`);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-8 col-lg-7">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                <i className="bi bi-person me-2"></i>
                {editing ? 'Edit' : 'New'} Personnel
              </h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name *</label>
                <input
                  type="text"
                  id="name"
                  className={`form-control ${nameError ? 'is-invalid' : ''}`}
                  value={name}
                  onChange={handleNameChange}
                  required
                />
                {nameError && (
                  <div className="invalid-feedback">{nameError}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="specialty" className="form-label">Specialty</label>
                <select
                  id="specialty"
                  className="form-select"
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                >
                  <option>A&P</option>
                  <option>Avionics</option>
                  <option>Integration</option>
                  <option>AMT</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  id="role"
                  className="form-select"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                >
                  <option>Captain</option>
                  <option>Coordinator</option>
                  <option>Collaborator</option>
                  <option>Trainee</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="shift" className="form-label">Shift</label>
                <select
                  id="shift"
                  className="form-select"
                  value={shift}
                  onChange={e => setShift(e.target.value)}
                >
                  <option>1st</option>
                  <option>2nd</option>
                  <option>3rd</option>
                </select>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={save} disabled={!name}>
                  <i className="bi bi-save me-2"></i>
                  Save
                </button>
                <button className="btn btn-secondary" onClick={() => nav('/personnel')}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Personnel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}