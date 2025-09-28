import React, { useState, useEffect } from 'react';
import { createPersonnel, getPersonnelById, updatePersonnel } from '../api/personnel';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateEditPersonnel() {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('A&P');
  const [role, setRole] = useState('Captain');
  const nav = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  useEffect(() => {
    if (editing) {
      getPersonnelById(id).then(p => {
        setName(p.name);
        setSpecialty(p.specialty);
        setRole(p.role);
      });
    }
  }, [editing, id]);

  const save = () => {
    const data = { name, specialty, role };
    const fn = editing ? updatePersonnel(id, data) : createPersonnel(data);
    fn.then(() => nav('/personnel'));
  };

  return (
    <div>
      <h2>{editing ? 'Edit' : 'New'} Personnel</h2>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Specialty</label>
        <select
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
        <label className="form-label">Role</label>
        <select
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
      <button className="btn btn-success me-2" onClick={save} disabled={!name}>Save</button>
      <button className="btn btn-link" onClick={() => nav('/personnel')}>Cancel</button>
    </div>
  );
}