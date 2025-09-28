import React, { useState, useEffect } from 'react';
import { getAllAircraft, deleteAircraft } from '../api/aircraft';
import { useNavigate } from 'react-router-dom';

export default function ListAircraft() {
  const [list, setList] = useState([]);
  const nav = useNavigate();

  useEffect(() => { getAllAircraft().then(setList); }, []);

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h2>Aircraft</h2>
        <button className="btn btn-primary" onClick={()=>nav('/aircraft/new')}>+ New</button>
      </div>
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Tail #</th><th>Actions</th></tr></thead>
        <tbody>
          {list.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td><td>{a.tail_number}</td>
              <td>
                <button className="btn btn-sm btn-secondary me-2" onClick={()=>nav(`/aircraft/${a.id}`)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={()=>{ if(window.confirm('Delete?')) deleteAircraft(a.id).then(()=>getAllAircraft().then(setList)); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}