import React, { useState, useEffect } from 'react';
import { getAllPersonnel, deletePersonnel } from '../api/personnel';
import { useNavigate } from 'react-router-dom';

export default function ListPersonnel() {
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  useEffect(() => { load(); }, []);
  const load = () => getAllPersonnel().then(setItems);

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Personnel</h2>
        <button className="btn btn-primary" onClick={() => nav('/personnel/new')}>+ New</button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialty</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.specialty}</td>
              <td>{p.role}</td>
              <td>
                <button className="btn btn-sm btn-secondary me-2" onClick={() => nav(`/personnel/${p.id}`)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => { if (window.confirm('Delete this person?')) deletePersonnel(p.id).then(load); }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}